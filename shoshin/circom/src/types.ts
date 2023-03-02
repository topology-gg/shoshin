export enum OpCodes {
  ADD = 1,
  SUB = 2,
  MUL = 3,
  DIV = 4,
  // MOD = 5,
  ABS = 6,
  // SQRT = 7,
  // POW = 8,

  IS_NN = 9,
  IS_LE = 10,
  NOT = 11,
  EQ = 12,

  // MEM = 13,
  DICT = 14,
  // FUNC = 15,
}

export interface OpTrace {
  // Select input/ trace output left
  sel_a: number;
  // Select input/ trace output right
  sel_b: number;
  op_code: OpCodes;
}

/**
 * The Circom form of the *description* of the function
 */
export interface CircomCanonicalFD {
  op_traces: OpTrace[];
  inputs_constant: number[];
}

export interface CircomMapping extends CircomCanonicalFD {
  n_inputs: number;
  n_traces: number;
  dict: number[];
  compiler_info?: CircomCompilerOutInfo[];
}

/**
 * @brief A basic merkle tree
 *
 * Index 0 is set to null. Then, index 1 is the root.
 * Also, for index i, the left child is 2 * i and the right is 2 * i + 1.
 * Thus, starting from the root (index 1), we can easily traverse the tree.
 * This also has the nice feature of the second half of the tree being composed onlyj
 * of leaves
 */
export type MerkleTree = bigint[];

export enum MerkleTreePosition {
  LEFT = 0,
  RIGHT = 1,
}

// Leaf index
type LeftNode = number;
type RightNode = number;

export type DagNode = [OpCodes, LeftNode, RightNode];
export type LeafNode<ValType> = [ValType, -1, -1];

/**
 * A dag node with the corresponding index
 */
export type IndexedNodeGen<ValType> = [DagNode | LeafNode<ValType>, number];

/**
 * A dag node with the corresponding index
 */
export type IndexedNode = [DagNode | LeafNode<number>, number];

export type DagGen<ValType> = (DagNode | LeafNode<ValType>)[];
export type Dag = (DagNode | LeafNode<number>)[];

/**
 * A lookup table from the `key` of node/leaf in a dag to some other value.
 * Normally, this is used to lookup the index of a node or leaf in an a list
 * and the key is the original index of a node in the `Dag` structure.
 */
export type DagDict = { [node_key: number]: number };

export enum CircomCompilerOutInfo {
  TRUNCATED_DICT,
  TRUNCATED_TRACES,
}

export const CIRCOM_PRIME = BigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
).valueOf();
