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