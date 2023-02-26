export default interface Leaf {
    value: number,
    left: Leaf|number,
    right: Leaf|number,
}

// flatten a leaf by recursing all the values 
// if is a unique operator type (see isUniqueOperator) then left value is -1
export function flattenN(n: Leaf) {
    if (typeof n.left === 'number' && typeof n.right == 'number') {
        return isUniqueOperator(n.value) ? [n.value, -1, 1, n.right, -1, -1]: [n.value, 1, 2, n.left, -1, -1, n.right, -1, -1]
    }
    if (typeof n.left === 'number') {
        return isUniqueOperator(n.value)? [n.value, -1, 1, ...flattenN(n.right as Leaf)]: [n.value, 1, 2, n.left, -1, -1, ...flattenN(n.right as Leaf)]
    }
    if (typeof n.right === 'number') {
        return [n.value, 1, brancheSize(n.left) + 1, ...flattenN(n.left), n.right, -1, -1]
    }
    return [n.value, 1, brancheSize(n.left) + 1, ...flattenN(n.left), ...flattenN(n.right)]
}

function isUniqueOperator(x: number) {
    return x == 6 || x == 7 || x == 11 || x == 13 || x == 14 || x == 15
}

// counts the size of a branch by recursing it
function brancheSize(n: Leaf) {
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