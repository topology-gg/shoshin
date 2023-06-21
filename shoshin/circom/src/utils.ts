//@ts-ignore
import { buildPoseidonReference } from 'circomlibjs';
import { CIRCOM_PRIME, DagNode, IndexedNode, LeafNode, OpCodes } from './types';
import crypto from 'crypto';

export const deepcopy = (obj: any) => JSON.parse(JSON.stringify(obj));

export const get_parent_node = (dag_idxed: IndexedNode[]): number => {
  const n_pointers_to = range(0, dag_idxed.length).fill(0);

  dag_idxed.forEach(([n, i]) => {
    const [_op, left, right] = n;
    if (!is_leaf(n)) {
      if (left !== -1) n_pointers_to[left] += 1;
      if (right !== -1) n_pointers_to[right] += 1;
    }
  });

  const idx = n_pointers_to.indexOf(0);
  const idxRev = n_pointers_to.lastIndexOf(0);
  if (idx === -1) throw `No root of dag found`;
  if (idx !== idxRev)
    throw `The dag has more than one root and is thus invalid`;
  return idx;
};

export const has_key = (key: number, dict: { [k: number | string]: any }) =>
  !(dict[key] === undefined || dict[key] === null);

export const is_leaf = (node: DagNode | LeafNode<any>): boolean => {
  const [_v, left, right] = node;
  return (left < 0 && right < 0) || _v === OpCodes.DICT;
};

/**
 * @brief Get an array ranging from [low, high)
 *
 * Like range in Python where we get an array from low to high with high being exclusive
 */
export const range = (low: number, high: number) =>
  Array.from(Array(high - low).keys()).map(i => i + low);

// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle_arr = <T>(arr: T[]) =>
  arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export const pad_array_to_len = <T>(arr: T[], len: number, fill: T | T[]) =>
  arr.length < len
    ? arr
        .concat(Array.isArray(fill) ? fill : Array(len - arr.length).fill(fill))
        .slice(0, len)
    : arr;

export const gen_circom_randomness = async () => {
  while (true) {
    // The CIRCOM Prime has at most 254 bits, so we can sample 32 bytes ==  256 bits
    // We can then accept anything 2 * CIRCOM prime and modulo the prime.
    // Otherwise, we reject. We thus avoid modulo bias as per
    // https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
    const rand_bytes: Buffer = await new Promise((res, rej) => {
      crypto.randomBytes(32, (e, buff) => {
        if (e) rej(e);
        res(buff);
      });
    });
    const samp = BigInt(`0x${rand_bytes.toString('hex')}`).valueOf();
    if (samp < CIRCOM_PRIME * 2n && samp >= 0n) {
      return samp % CIRCOM_PRIME;
    }
  }
};

let poseidon: any = null;
export const poseidon_hash = async (elems: any[]): Promise<bigint> => {
  if (poseidon === null) poseidon = await buildPoseidonReference();
  return BigInt(poseidon.F.toString(poseidon(elems))).valueOf();
};
