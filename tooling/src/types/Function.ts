import XRegExp, { MatchRecursiveValueNameMatch } from "xregexp"
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
    Add = '+',
    Sub = '-',
    OpenParenthesis = '(',
    CloseParenthesis = ')',
    OpenAbs = 'Abs(',
    CloseAbs = '|',
    Lt = '<',
    Lte = '<=',
    Equal = '==',
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
    let countParenthesis = 0
    let countAbs = 0
    let prevElement = { type: ElementType.Operator } as FunctionElement
    for (let e of f?.elements) {
        if (countParenthesis < 0 || countAbs < 0) {
            return false
        }
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
                    prevElement?.value !== Operator.CloseAbs) {
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
        return countParenthesis == 0 && countAbs == 0
    }
    return true
}

export interface N {
    value: number,
    left: N|number,
    right: N|number,
}

export function flattenN(n: N) {
    if (typeof n.left === 'number' && typeof n.right == 'number') {
        return isUniqueOperator(n.value) ? [n.value, -1, 1, n.right, -1, -1]: [n.value, 1, 2, n.left, -1, -1, n.right, -1, -1]
    }
    if (typeof n.left === 'number') {
        return isUniqueOperator(n.value)? [n.value, -1, 1, ...flattenN(n.right as N)]: [n.value, 1, 2, n.left, -1, -1, ...flattenN(n.right as N)]
    }
    if (typeof n.right === 'number') {
        return [n.value, 1, brancheSize(n.left) + 1, ...flattenN(n.left), n.right, -1, -1]
    }
    return [n.value, 1, brancheSize(n.left) + 1, ...flattenN(n.left), ...flattenN(n.right)]
}

function isUniqueOperator(x: number) {
    return x == 6 || x == 7 || x == 11 || x == 13 || x == 14 || x == 15
}

function brancheSize(n: N) {
    if (typeof n.left === 'number' && typeof n.right == 'number') {
        return n.left == -1? n.right == -1? 1: 2: 3
    }
    if (typeof n.left === 'number') {
        let add = n.left == -1? 1: 2
        return add + brancheSize(n.right as N)
    }
    if (typeof n.right === 'number') {
        return 2 + brancheSize(n.left as N)
    }
    return brancheSize(n.left) + brancheSize(n.right) + 1
}

export function parseFunction(f: Function) {
    let operator: N = parseInner(functionToStr(f)) 
    return operator
}

function parseInner(f: string) {
    f = f.trim()
    // Allows to match the parenthesis and extract inner and outer values
    let branches = XRegExp.matchRecursive(f, '\\(', '\\)', 'g', {
            valueNames: ['between', null, 'match', null],
            unbalanced: 'skip',
    });
    // If multiple operators at top level, match branches
    if (branches.length >= 2) {
        return matchBranches(branches)
    }
    if (branches.length > 0) {
        f = branches[0].value
    }
    // End regex in the case we have X OP Y where X and Y are either a string value or a number
    let end = / *([a-zA-Z0-9]+)/g
    let matches = []
    let m = end.exec(f)
    while(m) {
        matches.push(m)
        m = end.exec(f)
    }
    let regexOp = /  *([<=]+|AND|OR|\*|\/|%|-|\+) */g
    m = regexOp.exec(f)
    let valueOne = getParsedValue(matches[0][1])
    let valueTwo = getParsedValue(matches[1][1])
    return {value: operatorToNumber(m[1]), left: valueOne, right: valueTwo}
}

function matchBranches(branches: MatchRecursiveValueNameMatch[]) {
    // If multiple operators at top level, extract left and right side then continue parsing
    // Handle the case where one of the branches are in the form Abs() OP X
    if (branches.length > 2) {
        if (branches[0].value === 'Abs') {
            let split = branches[2].value.trim().split(' ')
            let parsed = getParsedValue(split[1])
            return {value: operatorToNumber(split[0]), left: parseInner('Abs('+branches[1].value+')'), right: parsed}
        }
        let recomposed = branches.slice(2).map((b) => {if(b.name === 'match'){return '('+b.value.trim()+')'} else{return b.value.trim()}}).join(' ')
        return {value: operatorToNumber(branches[1].value.trim()), left: parseInner(branches[0].value), right: parseInner(recomposed)}
    }
    // If only two branches, f is in the form () OP X or X OP () or Abs()
    if (branches.length == 2 ) {
        if (branches[0].value.includes('Abs')) {
            return {value: operatorToNumber('Abs'), left: -1, right: parseInner(branches[1].value)}
        }
        let [parenthesisIndex, restIndex] = branches[0].name === 'match'? [0,1] : [1, 0]
        let split = branches[restIndex].value.trim().split(' ')
        let parsed = getParsedValue(split[restIndex])
        return {value: operatorToNumber(split[parenthesisIndex]), left: parsed, right: parseInner(branches[parenthesisIndex].value)}
    }
}

function operatorToNumber(x: string) {
    return OPERATOR_VALUE[x.toUpperCase()]
}

function getParsedValue(x: string) {
    let parsedOne = parseInt(x)
    return isNaN(parsedOne) ? {value: 14, left:-1, right: Perceptible[x]}: parsedOne
}

export function functionToStr(f: Function) {
    let str = ''
    f.elements.forEach((e) => {
        let value = e.type === ElementType.Perceptible ? Perceptible[e.value] : e.value
        value = value === '|'? ')' : value
        str += value + ' '
    })
    return str
}