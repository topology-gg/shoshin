import XRegExp, { MatchRecursiveValueNameMatch } from 'xregexp'
import { OPERATOR_VALUE } from '../constants/constants'
import Leaf from './Leaf'

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

export function parseFunction(f: Function) {
    let operator: Leaf = parseInner(functionToStr(f))
    return operator
}

function parseInner(f: string) {
    f = f.trim()
    // Check if the first value is not a ! operator
    if (f[0] === '!') {
        return { value: OPERATOR_VALUE['!'], left: -1, right: parseInner(f.slice(1)) }
    }
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
    // or if we just have X
    let end = / *([a-zA-Z0-9]+)/g
    let matches = []
    let m = end.exec(f)
    while(m) {
        matches.push(m)
        m = end.exec(f)
    }
    let regexOp = /  *([<=]+|AND|OR|\*|\/|%|-|\+) */g
    m = regexOp.exec(f)
    if (matches.length < 2) {
        return getParsedValue(matches[0][1])
    }
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
        let unparsedBranches = branches.slice(2)
        let recomposed = unparsedBranches.map((b) => {if(b.name === 'match'){return '('+b.value.trim()+')'} else{return b.value.trim()}}).join(' ')
        let trimmedRecomposed = unparsedBranches.length == 1? recomposed.replace(/^\(/g, '').replace(/$\)/g, ''): recomposed
        return {value: operatorToNumber(branches[1].value.trim()), left: parseInner(branches[0].value), right: parseInner(trimmedRecomposed)}
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