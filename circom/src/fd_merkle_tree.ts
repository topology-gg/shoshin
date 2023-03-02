//@ts-ignore
import { buildPoseidonReference, buildPedersenHash } from 'circomlibjs';
import { assert } from 'console';
// import { SMT } from '@cedoor/smt';
import { CircomCanonicalFD, MerkleTree, MerkleTreePosition } from './types';

let poseidon_hash: any = null;
// let pedersen_hash: any = null;

// Hmmm.... we need to make this itself a merkle habib!
const shrunk_hash = async (child_nodes: any[]): Promise<bigint> => {
  if (poseidon_hash === null) poseidon_hash = await buildPoseidonReference();
  // if (pedersen_hash === null) pedersen_hash = await buildPedersenHash();

  const reduced = child_nodes.reduce((prev, a) => poseidon_hash([prev, a]), 0n);
  return BigInt(poseidon_hash.F.toString(reduced)).valueOf();
  // .map(a => pedersen_hash.babyJub.F.e(a)); // Map to uint8array
  // const ped_out = pedersen_hash.hash(mapped);
  // console.log(
  //   'AAAAAAAAAAA',
  //   child_nodes,
  //   child_nodes.length,
  //   mapped,
  //   ped_out,
  //   ped_out.length
  // );

  // const hP = pedersen_hash.babyJub.unpackPoint(ped_out);
  // return poseidon_hash(hP) as Uint8Array;
};

const get_mind_fd_hash = async (
  fd: CircomCanonicalFD,
  randomness: bigint,
  mind: number
): Promise<bigint> => {
  const hash_arr: bigint[] = [
    ...fd.inputs_constant,
    ...fd.op_traces.map(f => [f.op_code, f.sel_a, f.sel_b]).flat(),
    mind,
    randomness,
  ].map(b => BigInt(b).valueOf());
  return await shrunk_hash(hash_arr);
};

export const gen_merkle_tree = async (
  mind_to_fd: { fd: CircomCanonicalFD; randomness: bigint }[],
  n_levels: number
): Promise<MerkleTree> => {
  // Big number hashes.
  // const mind_fd_comms = await Promise.all(
  //   mind_to_fd.map((o, mind) => {
  //     return get_mind_fd_hash(o.fd, o.randomness, mind);
  //   })
  // );
  const mind_fd_comms = Array(mind_to_fd.length).fill(new Uint8Array());
  for (let i = 0; i < mind_to_fd.length; i++) {
    mind_fd_comms[i] = await get_mind_fd_hash(
      mind_to_fd[i].fd,
      mind_to_fd[i].randomness,
      i
    );
  }
  // A tree with `n_levels` has 2 ** n_levels - 1 nodes. Because we leave index 0 empty,
  // we can have a 2 ** n_levels length array
  const tree: bigint[] = Array(Math.pow(2, n_levels)).fill(0n);
  // We now populate the second half of the tree with the leaves
  const leave_start_idx = Math.pow(2, n_levels - 1);
  for (
    let i = leave_start_idx;
    i < leave_start_idx + mind_fd_comms.length;
    i++
  ) {
    tree[i] = mind_fd_comms[i - leave_start_idx];
  }

  // We now populate the nodes of the merkle tree starting from the deepest non-leaf nodes
  for (let i = leave_start_idx - 1; i > 0; i--) {
    if (poseidon_hash === null) await buildPoseidonReference();
    tree[i] = BigInt(
      poseidon_hash.F.toString(poseidon_hash([tree[i * 2], tree[i * 2 + 1]]))
    ).valueOf();
  }

  return tree;
};

export const get_merkle_tree_proof = (tree: MerkleTree, leaf_idx: number) => {
  const depth = Math.log2(tree.length);
  if (depth % 1 != 0)
    throw 'Tree must be a full tree and thus have length a power of 2';
  if (leaf_idx > tree.length / 2 || leaf_idx < 0)
    throw `Unexpected leaf index ${leaf_idx}`;
  const siblings: bigint[] = Array(depth - 1).fill(0n);
  // Signify if left or right.
  const sibling_pos: number[] = Array(depth - 1).fill(0);

  let curr_idx = tree.length / 2 + leaf_idx;
  for (let i = 0; i < depth - 1; i++) {
    // An odd element indicates being on the right
    const curr_pos =
      curr_idx % 2 === 1 ? MerkleTreePosition.RIGHT : MerkleTreePosition.LEFT;
    sibling_pos[i] =
      curr_pos === MerkleTreePosition.RIGHT
        ? MerkleTreePosition.LEFT
        : MerkleTreePosition.RIGHT;
    siblings[i] =
      curr_pos === MerkleTreePosition.RIGHT
        ? tree[curr_idx - 1]
        : tree[curr_idx + 1];
    curr_idx = Math.floor(curr_idx / 2);
  }
  return { siblings, sibling_pos };
};
