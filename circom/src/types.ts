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

export interface CircomMapping {
  n_inputs: number;
  n_traces: number;
  op_traces: OpTrace[];
  inputs_constant: number[];
  dict: number[];
  compiler_info?: CircomCompilerOutInfo[];
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
