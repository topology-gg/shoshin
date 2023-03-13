import { Tree } from "./Tree";
import Leaf, { wrapToLeaf } from './Leaf'

export interface MentalState {
    state: string,
    action: number,
}

export function parseTree(t: Tree, ms: MentalState[]): [Leaf, Map<number, number>] {
    let usedFunctions: Map<number, number> = new Map()
    let tCopy = JSON.parse(JSON.stringify(t))
    let operators = parseTreeInner(tCopy, ms, usedFunctions, 0)
    return [operators, usedFunctions]
}

// parse the mental states of the user input
function parseTreeInner(t: Tree, ms: MentalState[], usedFunctions: Map<number, number>, usedIndex: number): Leaf {
    if (t.nodes.length == 0) {
        return { value: 0, left: -1, right: -1}
    }
    // condition always located in first node
    let condition = t.nodes[0]
    // if condition is not a child -> parse the condition
    if (!condition?.isChild) {
        // t.nodes[1].id is the left branch of the tree
        let stateLeft = wrapToLeaf(ms.findIndex((mental) => t.nodes[1].id === mental.state))
        // condition is in the form 'if F0'
        let f = parseInt(condition.id.split(' ')[1][1])
        let fEval: Leaf
        // if function has already been used, add a MEM operator
        if (usedFunctions.has(f)) {
            fEval = { value: 13, left: -1, right: wrapToLeaf(usedFunctions.get(f)) }
        // else add a FUNC operator and add the function to the used functions (maps functions used to their index)
        } else {
            fEval = { value: 15, left: -1, right: wrapToLeaf(usedIndex) }
            usedFunctions.set(f, usedIndex)
            usedIndex += 1
        }
        // build the tree: FUNCTION_EVALUATION * STATE_LEFT + ((1 - FUNCTION_MEM) * RECURSIVE_CALL())
        let fMem: Leaf = { value: 13, left: -1, right: wrapToLeaf(usedFunctions.get(f)) }
        let subFEval: Leaf = { value: 2, left: wrapToLeaf(1), right: fMem }
        let leftBranch: Leaf = { value: 3, left: fEval, right: stateLeft }
        // slice the condition and the left branch
        t.nodes = t.nodes.slice(2)
        let rightBranch: Leaf = { value: 3, left: subFEval, right: parseTreeInner(t, ms, usedFunctions, usedIndex) }
        return { value: 1, left: leftBranch, right: rightBranch }
    }
    // if condition is a child -> return the corresponding state's index
    return {value: ms.findIndex((mental) => condition.id === mental.state), left: -1, right: -1}
}