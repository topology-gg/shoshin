import Leaf, { flattenLeaf, wrapToLeaf } from './Leaf'

export interface Condition {
    elements: ConditionElement[],
    key?: string,
    displayName ?: string
}

export interface ConditionElement {
    value?:  number | Operator | Perceptible,
    type?: ElementType,
}

export interface ConditionVerificationResult{
    isValid : boolean,
    message : string,
    conditionElementIndex : number,
    is_bracket_error : boolean
}

export enum ElementType {
    Operator = 'Operator',
    Constant = 'Constant',
    Perceptible = 'Perceptible',
    BodyState = 'BodyState'
}


export enum Operator {
    And = 'AND',
    Or = 'OR',
    Mul = '*',
    Div = '/',
    Mod = '%',
    Add = '+',
    Sub = '-',
    Lte = '<=',
    Equal = '==',
    Not = '!',
    OpenParenthesis = '(',
    CloseParenthesis = ')',
    OpenAbs = 'Abs(',
    CloseAbs = '|',
}

export const OPERATOR_VALUE: Map<string, number> = new Map(Object.entries({
    '+': 1,
    'OR': 1,
    '-': 2,
    '*': 3,
    'AND': 3,
    '/': 4,
    '%': 5,
    'Abs(': 6,
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

export const VALUE_OPERATOR: Map<number, string> = new Map()
OPERATOR_VALUE.forEach((v, k) => VALUE_OPERATOR[v] = k)


export enum BodystatesJessica {
    Idle = 0,
    Slash = 10,
    Upswing = 20,
    Sidecut = 30,
    Block = 40,
    Clash = 50,
    Hurt = 60,
    Knocked = 70,
    MoveForward  = 90,
    MoveBackward = 100,
    DashForward  = 110,
    DashBackward = 120,
}

export enum BodystatesAntoc {
    Idle = 0,
    HorizontalSwing = 1010,
    VerticalSwing = 1020,
    Block = 1040,
    Hurt = 1050,
    Knocked = 1060,
    MoveForward = 1090,
    MoveBackward = 1100,
    DashForward = 1110,
    DashBackward = 1120,
}

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
    SelfFatigued = 12,
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
    OpponentFatigued = 112,
}
export const PERCEPTIBLE_KEYS: number[] = Object.keys(Perceptible).map(k => parseInt(k)).filter(k => !isNaN(k))

// Verify that the input condition is valid
export function verifyValidCondition(c: Condition, confirm: boolean): ConditionVerificationResult {
    // count the open and close parenthesis
    let countParenthesis = 0
    // count the open and close absolute values
    let countAbs = 0
    let prevElement = { type: ElementType.Operator } as ConditionElement
    for (let [index, e] of c?.elements.entries()) {
        // Check that these rules are followed:
        //  - numeric value must not be followed by a opening parenthesis or abs
        //  - close parenthesis or abs must be preceded by a numeric value or a closing parenthesis
        //  - not operator cannot be preceded by a numeric value
        //  - not operator must be followed by open parenthesis or open abs
        let isCurrentSyntaxOpen = e?.value == Operator.OpenParenthesis || e?.value == Operator.OpenAbs
        let isCurrentSyntaxClose = e?.value == Operator.CloseParenthesis || e?.value == Operator.CloseAbs
        let isPrevNumeric = prevElement?.type === ElementType.Perceptible || prevElement.type === ElementType.Constant || prevElement.type === ElementType.BodyState
        if (isPrevNumeric && isCurrentSyntaxOpen) {
            return { isValid : false, message :  `Operator "${e?.value}" must be preceded by an operator`, conditionElementIndex : index, is_bracket_error : false}
        }
        if ((!isPrevNumeric && prevElement?.value !== Operator.CloseParenthesis) && isCurrentSyntaxClose) {
            return { isValid : false, message : `Operator "${e?.value}" must be preceded by a constant, perceptible or bodystate`, conditionElementIndex : index, is_bracket_error : false }
        }
        if (e?.value == Operator.Not && isPrevNumeric) {
            return { isValid : false, message :  `Operator "${e?.value}" must be preceded by operator`, conditionElementIndex : index, is_bracket_error : false }
        }
        if (prevElement?.value == Operator.Not && !isCurrentSyntaxOpen) {
            return { isValid : false, message :  `Operator "${prevElement?.value}" must be followed by ( or Abs(`, conditionElementIndex : index, is_bracket_error : false }

        }
        // if count negative, exit early
        if (countParenthesis < 0 || countAbs < 0) {
            return { isValid : false, message :  'Unbalanced parenthesis or absolute value', conditionElementIndex : index, is_bracket_error : true }
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
                if (e?.value == Operator.Not) {
                    break
                }
                if (!isPrevNumeric &&
                    prevElement?.value !== Operator.CloseParenthesis &&
                    prevElement?.value !== Operator.CloseAbs) {
                        return { isValid : false, message : `Operator "${e?.value}" must be preceded by a constant, perceptible or closing of absolute/parenthesis`, conditionElementIndex : index, is_bracket_error : false }
                }
                break
            }
            // constant, perceptible and bodystate must be preceded by an operator
            case ElementType.Constant:
            case ElementType.Perceptible:
            case ElementType.BodyState: {
                if (prevElement.type !== ElementType.Operator) {
                    return { isValid : false, message : `${e?.type} must be preceded by an operator`, conditionElementIndex : index, is_bracket_error : false }
                }
                break
            }
        }
        prevElement = e
    }
    if (confirm) {

        if(countParenthesis == 0 && countAbs == 0)
        {
            return { isValid : true, message : '', conditionElementIndex : -1, is_bracket_error :  false }
        }
        return { isValid : false, message : 'Unbalanced parenthesis or absolute value', conditionElementIndex : -1, is_bracket_error :  true }
    }
    return { isValid : true, message : '', conditionElementIndex : -1, is_bracket_error : false }
}

export function validateConditionName(name: string, conditions : Condition[]): string | undefined {
    if (name && /\s/.test(name)) {
        return "Name contains whitespace"
    }

    if (name.length > 31) {
        return "Name should be less than 31 characters long" + `\n String \"${name}\" is ${name.length} characters long!`
    }

    const nameCollision = conditions.find(condition => condition.displayName == name)

    if(nameCollision){
        return "Duplicate condition name exists"
    }
}

// Parse the elements of the condition into a folded Leaf type
export function parseConditionToLeaf(c: Condition): Leaf {
    let operator: Leaf = parseInner(c.elements)
    return operator
}

function parseInner(c: ConditionElement[]): Leaf {
    let elem: ConditionElement = c[0]
    // Check if f.length > 1
    if (c.length < 2) {
        return parseElement(elem)
    }
    // Check if the first value is not a ! operator
    if (elem.type === ElementType.Operator && elem.value === Operator.Not) {
        let value = OPERATOR_VALUE.get('!') ?? 0
        return { value: value, left: -1, right: parseInner(c.slice(1)) }
    }
    // Check if operator is parenthesis
    if (elem.type === ElementType.Operator && elem.value === Operator.OpenParenthesis) {
        // get the index of operator after parenthesis closing
        let i = getNextOpIndex(c)
        if (c[i]) {
            // if operator, apply operator, parse inner and outer of parenthesis
            let operator = operatorToNumber(c[i].value as Operator)
            return { value: operator, left: parseInner(c.slice(1, i - 1)), right: parseInner(c.slice(i + 1))}
        }
        // if no operator, parse the interior of the parenthesis
        return parseInner(c.slice(1, -1))
    }
    // Check if operator is Abs
    if (elem.type === ElementType.Operator && elem.value === Operator.OpenAbs) {
        // get the index of operator after abs closing
        let i = getNextOpIndex(c)
        let abs = operatorToNumber(Operator.OpenAbs)
        if (c[i]) {
            // if operator, apply operator, parse inner and outer of abs
            let operator = operatorToNumber(c[i].value as Operator)
            return { value: operator, left: {value: abs, left: -1, right: parseInner(c.slice(1, i - 1))}, right: parseInner(c.slice(i + 1)) }
        }
        // if no operator, parse the interior of the abs
        return { value: abs, left: -1, right: parseInner(c.slice(1, -1))}
    }
    // if no parenthesis, abs or !, parse the expression as X OPERATOR REST
    return parseOperation(elem, c[1], c.slice(2))
}

function parseOperation(val: ConditionElement, operator: ConditionElement, rest: ConditionElement[]): Leaf {
    let operand1 = parseElement(val)
    let op = operatorToNumber(operator.value as Operator)
    if (rest.length == 1) {
        let operand2 = parseElement(rest[0])
        return {value: op, left: operand1, right: operand2}
    }
    return { value: op, left: operand1, right: parseInner(rest) }
}

// Parse the element to a leaf. In case the element is a perceptible,
// add {value: 14, left: -1, right{...}} in order to access the
// perceptibles dictionnary
function parseElement(val: ConditionElement): Leaf {
    let value = val?.value as number
    return val?.type === ElementType.Perceptible? { value: 14, left:-1, right: wrapToLeaf(value) }: wrapToLeaf(value)
}

// Returns the index of the next operator exterior to the parenthesis
// ex: ((X OR Y) AND 10) OR Z would return 9
function getNextOpIndex(c: ConditionElement[]): number {
    let elem = c[0]
    let count = 0
    let isParenthesis = elem.value === Operator.OpenParenthesis
    for (let i =0; i< c.length; i++) {
        if (isParenthesis && c[i].value === Operator.OpenParenthesis) {
            count += 1
        }
        if (isParenthesis && c[i].value === Operator.CloseParenthesis) {
            count -= 1
        }
        if (!isParenthesis && c[i].value === Operator.OpenAbs) {
            count += 1
        }
        if (!isParenthesis && c[i].value === Operator.CloseAbs) {
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
    return OPERATOR_VALUE.get(x) ?? 0
}

// Parse the condition in order to add any bodystate
export function includeBodyState(c: ConditionElement[]): ConditionElement[] {
    let prev = false
    for (var elem of c) {
        if (isPerceptibleBodyState(elem)) {
            prev = true
        }
        if (elem.type === ElementType.Constant && prev) {
            elem.type = ElementType.BodyState
            prev = false
        }
    }
    return c
}

// True if the element is a perceptible and is a bodystate
export const isPerceptibleBodyState = (elem: ConditionElement) => {
    let value = elem?.value
    return (
        elem?.type === ElementType.Perceptible &&
        (value == Perceptible.OpponentBodyState ||
        value == Perceptible.SelfBodyState)
    )
}

// True if the element is an operator with double operands
export const isOperatorWithDoubleOperands = (elem: ConditionElement) => {
    let value = elem?.value
    return (
        elem?.type == ElementType.Operator &&
        value != Operator.OpenAbs &&
        value != Operator.OpenParenthesis &&
        value != Operator.CloseAbs &&
        value != Operator.CloseParenthesis
        && value != Operator.Not
    )
}

export function flattenCondition(condition: Condition) {
    let leafCondition: Leaf = parseConditionToLeaf(condition)
    return flattenLeaf(leafCondition) 
}


// Converts the current condition into its string representation
export function conditionToStr(c: Condition) {
    let str = ''
    c.elements.forEach((e) => {
        str += conditionElementToStr(e) + ' '
    })
    return str
}

// Converts the condition element into its string representation
export const conditionElementToStr = (elem: ConditionElement) => {
    let type = elem.type
    let value = elem.value
    if (type === ElementType.Perceptible) {
        return Perceptible[value].toString()
    }
    if (type === ElementType.BodyState) {
        if (value === 0) {
            return 'Idle'
        }
        value = value as number // can cast since type === BodyState
        return value > 1000 ? 'Antoc' + BodystatesAntoc[value] : 'Jessica' + BodystatesJessica[value]
    }
    if (type === ElementType.Operator) {
        // convert a close abs to a closed parenthesis
        return value === '|' ? ')' : value
    }
    return value
}
