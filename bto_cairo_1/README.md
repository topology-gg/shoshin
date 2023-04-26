# Introduction

## Binary tree

A binary tree is a type of data structure consisting of nodes, where each node can have zero, one or two children.
The top node is called the root, nodes without children are called leaf nodes or terminal nodes, while nodes with one
or two children are referred to as internal nodes. For more details: [binary tree](https://en.wikipedia.org/wiki/Binary_tree).

## Depth-First Search (DFS) algorithm

The DFS algorithm is a graph traversal algorithm that starts at a given source node and explores as far as possible
along the same branch before backtracking. In the case of a binary tree, the selected source node will usually be the
root of the tree. For more details: [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search).

# Operator tree representation

## Tree structure

The goal of the library is to allow user to input a binary tree representation of a function which is executed by
iterating the tree using DFS. Each internal node of the tree will than be a function operator (full list of operators can be found
in `constants.cairo`) or a constant. Operators can be unary operators (operators that operate on one operand), in which case
they will only have one children node, or they can be binary operators (operators that operate on two operands), in which case
they will have two children nodes.

A valid tree can be seen below, where the traversel order is indicated in parenthesis for each node:

```
              a(1)
            /     \
          b(2)    c(13)
        /     \      \
     d(3)     e(8)   f(14)
    /   \      / \
  g(4) h(7) i(9)  j(10)
 /   \            /   \
k(5) l(6)      m(11)  n(12)
```

## Node structure

A node is represented by the following structure:

```
struct Node {
  value: felt,
  left: felt,
  right: felt,
}
```

The `value` field holds either the type of the operator for internal nodes, or the value of the constant for leaf nodes. The left and right field are detailled
in the section on binary tree flattening.

## Opcodes

Internal nodes hold the type of function operators being used, which are referred to as operation codes or more commonly opcodes. Each opcodes (which can be found in `constants.cairo`) is
associated with a specific function operation, such as adding/multiplying two numbers together or more complex operations such as retrieving a value from a dictionary.

# Binary tree flattening

In order for the tree representation to the passed to the library input, it must first be converted into an array. This is where the `left` and `right` fields of the `Node`
structure intervene: those fields are used to hold the relative offset in the array to their children node or -1 if the node doesn't have a branch in that direction.

The term "relative offset" can be better explained when viewing the below image. The number in the nodes describe the order in which the nodes are visited.

![order in which nodes are visited](https://github.com/greged93/bto-cairo/blob/master/imgs/375px-Depth-first-tree.svg.png)

The offset between two nodes is the difference in their traversal index. Taking for example node 2 and his two children nodes 3 and 6, the difference in their traversal index with node 2
are respectively 1 and 4. Node 2 would thus be represented as

```
{
  value: OP_CODE,
  left:  1,
  right: 4,
}
```

# Summary

Taking in everything we have seen up to now, the below is a binary tree as described in the first sections. Each internal node represents an opcode such as add, div, mod,... while leaf
nodes are constant values such as 4, 2,...

```
            is_le(1)
            /       \
         add(2)    abs(13)
        /      \         \
    mul(3)     div(8)    -3(14)
    /    \      /   \
 pow(4)  3(7) 12(9)  mod(10)
  /   \              /    \
4(5)  2(6)        10(11)   7(12)
```

_<sub> Caption: Operator tree which can be translated to the function: </sub>_ $\small 4^2 \times 3 + 12 / (10 \mod 7) \le | -3 |$

From the previous section on binary tree flattening, we can derive the below array representation of the tree:

```
[{is_le, 1, 12}, {add, 1, 6}, {mul, 1, 4}, {pow, 1, 2}, {4, -1, -1}, {2, -1, -1}, {3, -1, -1}, {div, 1, 2}, {12, -1, -1}, {mod, 1, 2}, {10, -1, -1}, {7, -1, -1}, {abs, -1, 1}, {-3, -1, -1}]
```

# Tree Chaining

By using the output of a tree as the input of a another tree, it is possible to chain trees together. Tree chaining is made possible thanks to the use of a
memory array. The output of each tree is stored in this array and can be accessed using the MEM opcode.
An example of the use of the chaining of trees can be found in `tests/test_tree.cairo::test_execute_tree_chain`.

# Available Opcodes

| Opcode | Description                                                                                                                                                                                                                          | Tested |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| ADD    | Addition of left and right values                                                                                                                                                                                                    | ✅     |
| SUB    | Substraction of left and right values                                                                                                                                                                                                | ✅     |
| MUL    | Multiplication of left and right values                                                                                                                                                                                              | ✅     |
| DIV    | Division of left and right values                                                                                                                                                                                                    | ✅     |
| MOD    | Modulus of left and right values                                                                                                                                                                                                     | ✅     |
| ABS    | Absolute of right value                                                                                                                                                                                                              | ✅     |
| SQRT   | Square root of right value                                                                                                                                                                                                           | ✅     |
| POW    | Left value to the power of right value                                                                                                                                                                                               | ✅     |
| IS_NN  | 1 if right value >= 0, else 0                                                                                                                                                                                                        | ✅     |
| IS_LE  | 1 if left value <= right value, else 0                                                                                                                                                                                               | ✅     |
| NOT    | 1 if right value is 0, else 0                                                                                                                                                                                                        | ✅     |
| EQ     | 1 if left value == right value, else 0                                                                                                                                                                                               | ✅     |
| MEM    | Access the indexed values of previous trees output                                                                                                                                                                                   | ✅     |
| DICT   | Access values stored in the passed dictionary                                                                                                                                                                                        | ✅     |
| FUNC   | Access to the general purpose functions stored in <br /> the functions dictionary, allowing to evaluate a sub tree. <br /> The output of the subtree evaluation is saved in <br /> the memory array, accessable with the MEM opcode. | ✅     |
