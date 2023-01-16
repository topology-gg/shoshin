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
                if (prevElement.type !== ElementType.Perceptible && prevElement.type !== ElementType.Constant) {
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

export function functionToStr(f: Function) {
    let str = ''
    f.elements.forEach((e) => {
        let value = e.type === ElementType.Perceptible ? Perceptible[e.value] : e.value
        str += value + ' '
    })
    return str
}