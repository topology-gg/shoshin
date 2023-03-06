import Leaf, { wrapToLeaf } from './Leaf'

export interface Function {
    elements: FunctionElement[],
}

export interface FunctionElement {
    value?: Operator | number | Perceptible,
    type?: ElementType,
}

export enum ElementType {
    Operator = 'Operator',
    Constant = 'Constant',
    Perceptible = 'Perceptible',
}

export enum Operator {
    And = 'AND',
    Or = 'OR',
    Mul = '*',
    Div = '/',
    Mod = '%',
    Add = '+',
    Sub = '-',
    OpenParenthesis = '(',
    CloseParenthesis = ')',
    OpenAbs = 'Abs(',
    CloseAbs = '|',
    Lte = '<=',
    Equal = '==',
    Not = '!'
}

export const OPERATOR_VALUE: Map<string, number> = new Map(Object.entries({
    '+': 1,
    'OR': 1,
    '-': 2,
    '*': 3,
    'AND': 3,
    '/': 4,
    '%': 5,
    'ABS(': 6,
    'SQRT': 7,
    'POW': 8,
    'IS_NN': 9,
    '<=': 10,
    '!': 11,
    '==': 12,
    'MEM': 13,
    'DICT': 14,
    'FUNC': 15,
}))

export enum Perceptible {
    SelfX = 1,
    SelfY = 2,
    SelfVelX = 3,
    SelfVelY = 4,
    SelfAccX = 5,
    SelfAccY = 6,
    SelfDir = 7,
    SelfInt = 8,
    SelfSta = 9,
    SelfBodyState = 10,
    SelfBodyCounter = 11,
    OpponentX = 101,
    OpponentY = 102,
    OpponentVelX = 103,
    OpponentVelY = 104,
    OpponentAccX = 105,
    OpponentAccY = 106,
    OpponentDir = 107,
    OpponentInt = 108,
    OpponentSta = 109,
    OpponentBodyState = 110,
    OpponentBodyCounter = 111,
}

// Verify that the input function is valid
export function verifyValidFunction(f: Function, confirm: boolean) {
    // count the open and close parenthesis
    let countParenthesis = 0
    // count the open and close absolute values
    let countAbs = 0
    let prevElement = { type: ElementType.Operator } as FunctionElement
    for (let e of f?.elements) {
        // if count negative, exit early
        if (countParenthesis < 0 || countAbs < 0) {
            return false
        }
        // check the following rules are applied: operator must be preceded by
        // constant, perceptible, not operator, or closing of absolute/parenthesis
        switch (e?.type) {
            case ElementType.Operator: {
                if (e?.value == Operator.OpenParenthesis) {
                    countParenthesis += 1
                    break
                }
                if (e?.value == Operator.CloseParenthesis) {
                    countParenthesis -= 1
                    break
                }
                if (e?.value == Operator.OpenAbs) {
                    countAbs += 1
                    break
                }
                if (e?.value == Operator.CloseAbs) {
                    countAbs -= 1
                    break
                }
                if (prevElement.type !== ElementType.Perceptible &&
                    prevElement.type !== ElementType.Constant &&
                    prevElement?.value !== Operator.CloseParenthesis &&
                    prevElement?.value !== Operator.CloseAbs &&
                    prevElement?.value !== Operator.Not) {
                    return false
                }
                break
            }
            // constant must be preceded by an operator
            case ElementType.Constant: {
                if (prevElement.type !== ElementType.Operator) {
                    return false
                }
                break
            }
            // perceptible must be preceded by an operator
            case ElementType.Perceptible: {
                if (prevElement.type !== ElementType.Operator) {
                    return false
                }
                break
            }
        }
        prevElement = e
    }
    if (confirm) {
        return countParenthesis == 0 && countAbs == 0
    }
    return true
}

// Parse the elements of the function into a folded Leaf type
export function parseFunction(f: Function): Leaf {
    let operator: Leaf = parseInner(f.elements)
    return operator
}

function parseInner(f: FunctionElement[]): Leaf {
    let elem: FunctionElement = f[0]
    // Check if f.length > 1
    if (f.length < 2) {
        return parseElement(elem)
    }
    // Check if the first value is not a ! operator
    if (elem.type === ElementType.Operator && elem.value === Operator.Not) {
        let value = OPERATOR_VALUE.get('!') ?? 0
        return { value: value, left: -1, right: parseInner(f.slice(1)) }
    }
    // Check if operator is parenthesis
    if (elem.type === ElementType.Operator && elem.value === Operator.OpenParenthesis) {
        // get the index of operator after parenthesis closing
        let i = getNextOpIndex(f)
        if (f[i]) {
            // if operator, apply operator, parse inner and outer of parenthesis
            let operator = operatorToNumber(f[i].value as Operator)
            return { value: operator, left: parseInner(f.slice(1, i - 1)), right: parseInner(f.slice(i + 1))}
        }
        // if no operator, parse the interior of the parenthesis
        return parseInner(f.slice(1, -1))
    }
    // Check if operator is Abs
    if (elem.type === ElementType.Operator && elem.value === Operator.OpenAbs) {
        // get the index of operator after abs closing
        let i = getNextOpIndex(f)
        if (f[i]) {
            // if operator, apply operator, parse inner and outer of abs
            let operator = operatorToNumber(f[i].value as Operator)
            let abs = operatorToNumber(Operator.OpenAbs)
            return { value: operator, left: {value: abs, left: -1, right: parseInner(f.slice(1, i - 1))}, right: parseInner(f.slice(i + 1)) }
        }
        // if no operator, parse the interior of the abs
        return parseInner(f.slice(1, -1))
    }
    // if no parenthesis, abs or !, parse the expression as X OPERATOR Y
    return parseOperation(elem, f[1], f[2])
}

function parseOperation(val1: FunctionElement, operator: FunctionElement, val2: FunctionElement): Leaf {
    let value = val1.value as number
    let operand1 = parseElement(val1)
    let op = operatorToNumber(operator.value as Operator)
    value = val2.value as number
    let operand2 = parseElement(val2)
    return {value: op, left: operand1, right: operand2}
}

// Parse the element to a leaf. In case the element is a perceptible,
// add {value: 14, left: -1, right{...}} in order to access the 
// perceptibles dictionnary
function parseElement(val: FunctionElement): Leaf {
    let value = val.value as number
    return val.type === ElementType.Perceptible? { value: 14, left:-1, right: wrapToLeaf(value) }: wrapToLeaf(value)
}

// Returns the index of the next operator exterior to the parenthesis
// ex: ((X OR Y) AND 10) OR Z would return 9
function getNextOpIndex(f: FunctionElement[]): number {
    let elem = f[0]
    let count = 0
    let isParenthesis = elem.value === Operator.OpenParenthesis
    for (let i =0; i< f.length; i++) {
        if (isParenthesis && f[i].value === Operator.OpenParenthesis) {
            count += 1
        }
        if (isParenthesis && f[i].value === Operator.CloseParenthesis) {
            count -= 1
        }
        if (!isParenthesis && f[i].value === Operator.OpenAbs) {
            count += 1
        }
        if (!isParenthesis && f[i].value === Operator.CloseAbs) {
            count -= 1
        }
        // if we hit count == 0, next operator is out of the parenthesis
        if (count == 0) {
            return i + 1
        }
    }
    return count
}

// Converts the operator in string into the corresponding
// opcode number
function operatorToNumber(x: string): number {
    return OPERATOR_VALUE.get(x.toUpperCase()) ?? 0
}

// Converts the current function into its string representation
export function functionToStr(f: Function) {
    let str = ''
    f.elements.forEach((e) => {
        let v = e.value as number
        let value = e.type === ElementType.Perceptible ? Perceptible[v] : e.value
        value = value === '|'? ')' : value
        str += value + ' '
    })
    return str
}