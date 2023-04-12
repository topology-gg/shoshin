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

export function updateTreeToMatchConditions(tree: Tree, conditions: Condition[]) {
    tree.nodes.forEach((node) => {
        let matchingCondition = conditions.find((condition) => condition.key === node.id)
        node.id = matchingCondition?.displayName || node.id
    })
}