import { Tree } from "./Tree";
import Leaf from './Leaf'

export interface MentalState {
    state: string,
    action: number,
}

export function parseMentalState(t: Tree, ms: MentalState[]): [Leaf, Map<number, number>] {
    let usedFunctions: Map<number, number> = new Map()
    let tCopy = JSON.parse(JSON.stringify(t))
    let operators = parseInner(tCopy, ms, usedFunctions, 0) as Leaf
    return [operators, usedFunctions]
}

function parseInner(t: Tree, ms: MentalState[], usedFunctions: Map<number, number>, usedIndex: number) {
    if (t.nodes.length == 0) {
        return
    }
    let condition = t.nodes[0]
    if (!condition?.isChild) {
        let stateLeft = ms.findIndex((mental) => t.nodes[1].id === mental.state)
        let f = parseInt(condition.id.split(' ')[1][1])
        let fEval: Leaf
        if (usedFunctions.has(f)) {
            fEval = { value: 13, left: -1, right: usedFunctions.get(f) } 
        } else {
            fEval = { value: 15, left: -1, right: usedIndex }
            usedFunctions.set(f, usedIndex)
            usedIndex += 1
        }
        let fMem: Leaf = { value: 13, left: -1, right: usedFunctions.get(f) }
        let subFEval: Leaf = { value: 2, left: 1, right: fMem }
        let leftBranch: Leaf = { value: 3, left: fEval, right: stateLeft }
        t.nodes = t.nodes.slice(2)
        let rightBranch: Leaf = { value: 3, left: subFEval, right: parseInner(t, ms, usedFunctions, usedIndex) }
        return { value: 1, left: leftBranch, right: rightBranch }
    }
    return ms.findIndex((mental) => condition.id === mental.state)
}