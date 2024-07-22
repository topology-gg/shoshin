export interface Node {
    value: number;
    left: Node | null;
    right: Node | null;
}

export interface Edge {
    from: number;
    to: number;
}

export function buildNode(
    adjacencyList: Map<number, number[]>,
    nodeValue: number = 1
): Node | null {
    if (!adjacencyList.has(nodeValue)) {
        return { value: nodeValue, left: null, right: null };
    }

    const children = adjacencyList.get(nodeValue)!;
    const leftChild =
        children.length > 0 ? buildNode(adjacencyList, children[0]) : null;
    const rightChild =
        children.length > 1 ? buildNode(adjacencyList, children[1]) : null;

    return {
        value: nodeValue,
        left: leftChild,
        right: rightChild,
    };
}

export function orderEdges(edges: Edge[]) {
    edges.sort((a, b) => {
        if (a.from == b.from) {
            return a.to - b.to;
        }
        return a.from - b.from;
    });
}

export function edgesToAdjacencyList(edges: Edge[]): Map<number, number[]> {
    const adjList = new Map<number, number[]>();
    for (const edge of edges) {
        if (!adjList.has(edge.from)) {
            adjList.set(edge.from, []);
        }
        adjList.get(edge.from)?.push(edge.to);
    }
    return adjList;
}
