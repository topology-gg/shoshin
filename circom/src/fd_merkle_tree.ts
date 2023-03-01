//@ts-ignore
import { buildPoseidonReference } from 'circomlibjs';
import { assert } from 'console';
// import { SMT } from '@cedoor/smt';
import { CircomCanonicalFD, MerkleTree, MerkleTreePosition } from './types';

let poseidonHash: any = null;

// Hmmm.... we need to make this itself a merkle habib!
const hash = async (childNodes: any[]): Promise<Uint8Array> => {
  if (poseidonHash == null) poseidonHash = await buildPoseidonReference();
  console.log('AAAAAAAAAAA', childNodes.length);
  return poseidonHash(childNodes) as Uint8Array;
};

const get_mind_fd_hash = async (
  fd: CircomCanonicalFD,
  randomness: bigint,
  mind: number
): Promise<Uint8Array> => {
  const hash_arr: bigint[] = [
    ...fd.inputs_constant,
    ...fd.op_traces.map(f => [f.op_code, f.sel_a, f.sel_b]).flat(),
    mind,
    randomness,
  ].map(b => BigInt(b).valueOf());
  return hash(hash_arr);
};

export const gen_merkle_tree = async (
  mind_to_fd: { fd: CircomCanonicalFD; randomness: bigint }[],
  n_levels: number
): Promise<MerkleTree> => {
  // Big number hashes.
  // const tree = new SMT(hash, true);
  const mind_fd_comms = await Promise.all(
    mind_to_fd.map((o, mind) => {
      return get_mind_fd_hash(o.fd, o.randomness, mind);
    })
  );
  // A tree with `n_levels` has 2 ** n_levels - 1 nodes. Because we leave index 0 empty,
  // we can have a 2 ** n_levels length array
  const tree: Uint8Array[] = Array(Math.pow(2, n_levels)).fill(
    new Uint8Array([])
  );
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
    tree[i] = await hash([tree[i * 2], tree[i * 2 + 1]]);
  }

  return tree;
};

export const get_merkle_tree_proof = (tree: MerkleTree, leaf_idx: number) => {
  const depth = Math.log2(tree.length);
  if (depth % 1 != 0)
    throw 'Tree must be a full tree and thus have length around a power of 2';
  if (leaf_idx > tree.length / 2 || leaf_idx < 0)
    throw `Unexpected leaf index ${leaf_idx}`;
  const siblings: Uint8Array[] = Array(depth).fill(0n);
  // Signify if left or right.
  const sibling_pos: number[] = Array(depth).fill(0);

  let curr_idx = tree.length / 2 + leaf_idx;
  for (let i = 0; i < depth; i++) {
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
  assert(
    curr_idx === 0,
    'Expected to finish off the loop with current index being 0'
  );
  return { siblings, sibling_pos };
};
