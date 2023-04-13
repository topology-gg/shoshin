import { Condition } from "./Condition"

export interface Tree {
    nodes: Node[],
}

export interface Node {
    id: string,
    isChild: boolean,
    branch?: Direction,
}

export enum Direction {
    Left = 'left',
    Right = 'right',
}

export function getMentalStatesNames(tree: Tree) {
    return tree.nodes.filter(n => n.isChild).map(n => n.id)
}

export function getConditionsIndex(tree: Tree, conditionNames: string[]) {
    let conditionsIndex = tree.nodes.filter(node => !node.isChild).map((node) => {
        let matchingConditionIndex = getMatchingConditionIndexViaName(node, conditionNames)
        return matchingConditionIndex
    })
    return conditionsIndex
}

function getMatchingConditionIndexViaName(node: Node, conditions: string[]) {
    let matchingCondition = getMatchingConditionViaName(node, conditions)
    return conditions.indexOf(matchingCondition)
}

function getMatchingConditionViaName(node: Node, conditions: string[]) {
    return conditions.find((condition) => {
        return condition === node.id 
    })
}
