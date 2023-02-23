import { IndexedNode } from './types';

export const deepcopy = (obj: any) => JSON.parse(JSON.stringify(obj));

export const get_parent_node = (tree_idxed: IndexedNode[]): number => {
  const n_pointers_to = Array(tree_idxed.length).fill(0);

  tree_idxed.forEach(([[_, left, right], i]) => {
    if (left !== -1) n_pointers_to[left] += 1;
    if (right !== -1) n_pointers_to[right] += 1;
  });

  const idx = n_pointers_to.indexOf(0);
  const idxRev = n_pointers_to.lastIndexOf(0);
  if (idx === -1) throw `No root of tree found`;
  if (idx !== idxRev)
    throw `The tree has more than one root and is thus invalid`;
  return idx;
};
