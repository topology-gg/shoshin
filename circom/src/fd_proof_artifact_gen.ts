//@ts-ignore
import { buildPoseidonReference } from 'circomlibjs';
import { dag_to_circom } from './compile/json_compiler';
import {
  get_merkle_tree_proof,
  get_mind_fd_hash,
  leaf_index_of,
} from './fd_merkle_tree';
import { ts_dag_evaluator } from './ts_evaluator';
import { CircomCompilerOutInfo, Dag, MerkleTree } from './types';
import { gen_circom_randomness } from './utils';

interface FDProofInputs {
  mt_root: bigint;
  mt_siblings: bigint[];
  mt_sibling_positions: number[];

  current_mind_comm: bigint;
  current_mind_randomness: bigint;
  current_mind: number;

  next_state_randomness: bigint;
  next_state_comm: bigint;

  input_dict: number[];
  input_constants: number[];
  fd_trace_inp_selectors: [number, number][];
  fd_trace_type_selectors: number[];
  fd_comm_randomness: bigint;
}

export const gen_fd_proof_inputs = async (
  tree: MerkleTree,
  dag: Dag,
  dict: number[],
  mind: number,
  mind_randomness: bigint,
  fd_randomness: bigint,
  max_constants: number,
  max_dict: number,
  max_trace: number
): Promise<FDProofInputs> => {
  const next_state = ts_dag_evaluator(dag, dict).valueOf();
  const next_state_randomness = gen_circom_randomness();
  const circom_dag = dag_to_circom(
    dag,
    dict,
    max_constants,
    max_dict,
    max_trace
  );
  if (
    circom_dag.compiler_info?.includes(
      CircomCompilerOutInfo.TRUNCATED_CONSTANTS
    ) ||
    circom_dag.compiler_info?.includes(CircomCompilerOutInfo.TRUNCATED_DICT) ||
    circom_dag.compiler_info?.includes(CircomCompilerOutInfo.TRUNCATED_TRACES)
  ) {
    throw `DAG overflowed the maximum number of constants, dict, or traces`;
  }
  const dag_hash = await get_mind_fd_hash(circom_dag, fd_randomness, mind);
  const leaf_idx = leaf_index_of(tree, dag_hash);
  if (leaf_idx === -1)
    throw `Leaf for DAG with hash ${dag_hash} not found in the Merkle Tree`;

  const poseidon_hash = await buildPoseidonReference();
  const proof = get_merkle_tree_proof(tree, leaf_idx);
  const current_mind_comm = poseidon_hash([
    BigInt(mind).valueOf(),
    mind_randomness,
  ]);
  return {
    current_mind_comm,
    current_mind: mind,
    current_mind_randomness: mind_randomness,

    next_state_comm: poseidon_hash([next_state, next_state_randomness]),
    next_state_randomness,

    mt_root: tree[1],
    mt_siblings: proof.siblings,
    mt_sibling_positions: proof.sibling_pos,

    input_dict: dict,
    input_constants: circom_dag.inputs_constant,
    fd_trace_inp_selectors: circom_dag.op_traces.map(o => [o.sel_a, o.sel_b]),
    fd_trace_type_selectors: circom_dag.op_traces.map(o => o.op_code),
    fd_comm_randomness: fd_randomness,
  };
};
