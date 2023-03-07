export default interface Leaf {
    value: number,
    left: Leaf|number,
    right: Leaf|number,
}

export function wrapToLeaf(x: number): Leaf {
    return { value: x, left: -1, right: -1 }
}

// flatten a leaf by recursing all the values 
// if is a unique operator type (see isUniqueOperator) then left value is -1
export function flattenN(n: Leaf): number[] {
    if (n.left == -1 && n.right == -1) {
        return [n.value, -1, -1]
    }
    if (n.left == -1) {
        return [n.value, -1, 1, ...flattenN(n.right as Leaf)]
    }
    return [n.value, 1, brancheSize(n.left as Leaf) + 1, ...flattenN(n.left as Leaf), ...flattenN(n.right as Leaf)]
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