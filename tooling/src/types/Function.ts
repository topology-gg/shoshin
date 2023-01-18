import { OPERATOR_VALUE } from "../constants/constants"

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
    OpenParenthesis = '(',
    CloseParenthesis = ')',
    Lt = '<',
    Lte = '<=',
    Equal = '==',
}

const OPS = Object.values(Operator).filter((o) => o !== '(' && o !== ')').join('').trim().replace('/', '\/')

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
}

export function verifyValidFunction(f: Function, confirm: boolean) {
    let count = 0
    let prevElement = { type: ElementType.Operator } as FunctionElement
    for (let e of f?.elements) {
        if (count < 0) {
            return false
        }
        switch (e?.type) {
            case ElementType.Operator: {
                if (e?.value == Operator.OpenParenthesis) {
                    count += 1
                    break
                }
                if (e?.value == Operator.CloseParenthesis) {
                    count -= 1
                    break
                }
                if (prevElement.type !== ElementType.Perceptible && prevElement.type !== ElementType.Constant && prevElement?.value !== Operator.CloseParenthesis) {
                    return false
                }
                break
            }
            case ElementType.Constant: {
                if (prevElement.type !== ElementType.Operator) {
                    return false
                }
                break
            }
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
        return count == 0
    }
    return true
}

export interface N {
    value: number,
    left: N[]|number,
    right: N[]|number,
}

export function parseFunction(f: Function) {
    let testString = '( OpponentBodyState == 10 ) OR ( OpponentBodyState == 20 ) OR ( OpponentBodyState == 30 ) '
    let operator: N = parseInner(testString) 
    return operator
}

function parseInner(f: string) {
    let branches: string[] = f.includes(')') ? getBranches(f): [f]
    if (branches.length == 1) {
        let regex = new RegExp(` *([0-9a-zA-Z]+) *([${OPS}]+) *([0-9a-zA-Z]+) *`, 'g')
        let exp = regex.exec(branches[0])
        let operator = OPERATOR_VALUE[exp[2]]
        let parsed_one = parseInt(exp[1])
        let value_one = isNaN(parsed_one) ? Perceptible[exp[1]]: parsed_one
        let parsed_two = parseInt(exp[3])
        let value_two = isNaN(parsed_two) ? Perceptible[exp[3]]: parsed_two
        return {value: operator, left: value_one, right: value_two}
    }
    let recomposed = branches.slice(2).map((b) => Object.values(Operator).includes(b)? b: '('+b+')').join(' ')
    return {value: branches[1], left: parseInner(branches[0]), right: parseInner(recomposed)}
}

function getBranches(f: string) {
    let branches = []
    let counter = 0
    let position = 0
    let inParenthesis = false
    for (let i = 0; i < f.length; i++) {
        if (f[i] === '(') {
            counter += 1
            if (!inParenthesis) {
                position = i
            }
            inParenthesis = true
        }
        if (f[i] === ')') {
            counter -= 1
        }
        if (!counter && inParenthesis) {
            branches.push(f.slice(position + 1, i))
            if (i+2 < f.length) {
                branches.push(f.slice(i + 2, f.indexOf('(', i + 1)).trim())
            }
            inParenthesis = false
        }
    }
    return branches
}

export function functionToStr(f: Function) {
    let str = ''
    f.elements.forEach((e) => {
        let value = e.type === ElementType.Perceptible ? Perceptible[e.value] : e.value
        str += value + ' '
    })
    return str
}