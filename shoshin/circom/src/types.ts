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

export interface OpBuffer {
  // Select input/ buffer output left
  sel_a: number;
  // Select input/ buffer output right
  sel_b: number;
  op_code: OpCodes;
}

export interface CircomMapping {
  n_inputs: number;
  n_buffers: number;
  op_buffers: OpBuffer[];
  inputs_constant: number[];
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
