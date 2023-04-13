import { ElementType, ConditionElement, Operator, OPERATOR_VALUE, VALUE_OPERATOR } from "./Condition"
import { Direction, Node } from "./Tree"

export default interface Leaf {
    value: number,
    left: Leaf|number,
    right: Leaf|number,
}

export interface SimpleLeaf {
    value: number,
    left: number,
    right: number,
}

export function wrapToLeaf(x: number): Leaf {
    return { value: x, left: -1, right: -1 }
}

// flatten a leaf by recursing all the values 
// if is a unique operator type (see isUniqueOperator) then left value is -1
export function flattenLeaf(n: Leaf): number[] {
    if (n.left == -1 && n.right == -1) {
        return [n.value, -1, -1]
    }
    if (n.left == -1) {
        return [n.value, -1, 1, ...flattenLeaf(n.right as Leaf)]
    }
    return [n.value, 1, brancheSize(n.left as Leaf) + 1, ...flattenLeaf(n.left as Leaf), ...flattenLeaf(n.right as Leaf)]
}

// counts the size of a branch by recursing it
function brancheSize(n: Leaf): number {
    if (typeof n.left === 'number' && typeof n.right == 'number') {
        // two -1 indicates that the value is a constant: return 1
        // one -1 indicates a unique operator: return 2
        // no one indicates a operator: return 3
        return n.left == -1? n.right == -1? 1: 2: 3
    }
    if (typeof n.left === 'number') {
        // n.left = -1 indicates unique operator: add only 1
        let add = n.left == -1? 1: 2
        return add + brancheSize(n.right as Leaf)
    }
    if (typeof n.right === 'number') {
        // neither n.left or n.right are 0: add 2
        return 2 + brancheSize(n.left as Leaf)
    }
    return brancheSize(n.left) + brancheSize(n.right) + 1
}

// unflatten a array of Leaf
export function unflattenLeaf(n: SimpleLeaf[]): Leaf {
    // first value contains the operator
    // right and left contain the offsets in n on which
    // the operator applies
    let leaf = n[0]
    // if the offsets are -1 -> return constant
    if (leaf.left == -1 && leaf.right == -1) {
        return leaf
    }
    // recurse in the array and reconstruct the Leaf
    if (leaf.left == -1) {
        return {value: leaf.value, left: leaf.left, right: unflattenLeaf(n.slice(leaf.right))}
    }
    return {value: leaf.value, left: unflattenLeaf(n.slice(leaf.left)), right: unflattenLeaf(n.slice(leaf.right))}
}

// Unwraps the leaf representation of a condition into an array of condition elements
export function unwrapLeafToCondition(f: Leaf): ConditionElement[] {
    if(f.left == -1 && f.right == -1) {
        return [{value: f.value, type: ElementType.Constant}]
    }
    if (f.left == -1) {
        // if perceptible, f.right.value contains the perceptible value
        // else convert value to operator and keep unwrapping
        return isPerceptible(f.value)? [{value: (f.right as Leaf).value, type: ElementType.Perceptible}]: 
               isAbs(f.value) ? [{value: VALUE_OPERATOR[f.value], type: ElementType.Operator}, ...unwrapLeafToCondition(f.right as Leaf), {value: Operator.CloseAbs, type: ElementType.Operator}]: 
               [{value: VALUE_OPERATOR[f.value], type: ElementType.Operator}, ...unwrapLeafToCondition(f.right as Leaf)]
    }
    // if f.left != -1 and f.right != -1, surround with parenthesis
    // and keep unwrapping
    return [
        {value: Operator.OpenParenthesis, type: ElementType.Operator},
        ...unwrapLeafToCondition(f.left as Leaf),
        {value: VALUE_OPERATOR[f.value], type: ElementType.Operator},
        ...unwrapLeafToCondition(f.right as Leaf),
        {value: Operator.CloseParenthesis, type: ElementType.Operator},
    ]
}

function isPerceptible(value: number) {
    return value == OPERATOR_VALUE.get('DICT')
}

function isAbs(value: number) {
    return value == OPERATOR_VALUE.get('Abs(')
}

// Unwraps the leaf representation of a mental state state machine into an array of nodes
// Leaf will always be in the form CONDITION_EVALUATION * STATE_LEFT + ((1 - CONDITION_MEM) * RECURSIVE_CALL()) 
// (see parseTreeInner in MentalState.ts)
export function unwrapLeafToTree(f: Leaf, msNames: string[], conditionNames: string[]): Node[] {
    if(f.left == -1 && f.right == -1) {
        return [{id: msNames[f.value], isChild: true, branch: Direction.Right}]
    }
    let conditionIndex = getCondition(f) ?? 0
    let recurse = getRecurse(f) ?? {value: 0, left: -1, right: -1}
    let msIndex = getMS(f) ?? 0

    return [
        {id: conditionNames[conditionIndex], isChild: false}, 
        {id: msNames[msIndex], isChild: true, branch: Direction.Left}, 
        ...unwrapLeafToTree(recurse, msNames, conditionNames)
    ]
}

function getCondition(l: Leaf): number {
    return (((l.left as Leaf)?.left as Leaf)?.right as Leaf)?.value
}

function getRecurse(l: Leaf): Leaf {
    return (l.right as Leaf).right as Leaf
}

function getMS(l: Leaf): number {
    return ((l.left as Leaf).right as Leaf).value 
}