import { tree_to_circom } from '../../compile/json_compiler';
import { tree_simple } from './tree_test_common';

describe('compiler', () => {
  it('should compile a basic Shoshin tree to the circom representation', () => {
    const max_number_inputs = 10;

    const { n_inputs, n_buffers, op_buffers, inputs } = tree_to_circom(
      tree_simple,
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
