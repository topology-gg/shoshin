import { resolve } from 'path';
import { Tree, tree_to_circom } from '../../compile/json_compiler';
import { OpCodes } from '../../types';

describe.only('compiler', () => {
  it('should compile a basic Shoshin tree to the circom representation', () => {
    const max_number_inputs = 10;
    const tree: Tree = [
      [OpCodes.IS_LE, 1, 3],
      [OpCodes.ABS, -1, 2],
      [-10, -1, -1],
      [OpCodes.ADD, 4, 5],
      [2, -1, -1],
      [7, -1, -1],
    ];
    const { n_inputs, n_buffers, op_buffers, inputs } = tree_to_circom(
      tree,
      max_number_inputs
    );
    expect(n_inputs).toEqual(3);
    expect(n_buffers).toEqual(3);
    expect(op_buffers).toEqual([
      { sel_a: 0, sel_b: 0, op_code: 6 },
      { sel_a: 1, sel_b: 2, op_code: 1 },
      { sel_a: 10, sel_b: 11, op_code: 10 },
    ]);
    expect(inputs).toEqual([-10, 2, 7]);
  });
  xit('should throw an error when the maximum number of inputs are exceeded', () => {});
  xit('should throw an error when the maximum number of buffers are exceeded', () => {});
});
