import { DagNode, IndexedNode, LeafNode, OpCodes } from './types';

export const deepcopy = (obj: any) => JSON.parse(JSON.stringify(obj));

export const get_parent_node = (dag_idxed: IndexedNode[]): number => {
  const n_pointers_to = range(0, dag_idxed.length).fill(0);

  dag_idxed.forEach(([n, i]) => {
    const [_op, left, right] = n;
    if (!isLeaf(n)) {
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

export const isLeaf = (node: DagNode | LeafNode<any>): boolean => {
  const [_v, left, right] = node;
  return (left < 0 && right < 0) || _v === OpCodes.DICT;
};

export const range = (low: number, high: number) =>
  Array.from(Array(high - low).keys()).map(i => i + low);

// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle_arr = <T>(arr: T[]) =>
  arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
