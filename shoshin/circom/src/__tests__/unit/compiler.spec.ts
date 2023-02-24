import { dag_to_circom } from '../../compile/json_compiler';
import { dag_arithmetic_with_memo, dag_simple } from './dag_test_common';

describe('compiler', () => {
  it('should compile a basic Shoshin dag to the circom representation', () => {
    const max_number_inputs = 10;
    const max_number_dicts = 10;

    const { n_inputs, n_buffers, op_buffers, inputs_constant } = dag_to_circom(
      dag_simple,
      max_number_inputs,
      max_number_dicts
    );
    expect(n_inputs).toEqual(3);
    expect(n_buffers).toEqual(3);
    expect(op_buffers).toEqual([
      { sel_a: 0, sel_b: 0, op_code: 6 },
      { sel_a: 1, sel_b: 2, op_code: 1 },
      {
        sel_a: max_number_dicts + max_number_inputs,
        sel_b: max_number_dicts + max_number_inputs + 1,
        op_code: 10,
      },
    ]);
    expect(inputs_constant).toEqual([-10, 2, 7]);
  });

  it('should test a dag with a node having multiple parents', () => {
    const max_number_inputs = 10;
    const max_number_dicts = 10;

    const {
      n_inputs,
      n_buffers,
      op_buffers,
      inputs_constant: inputs,
    } = dag_to_circom(
      dag_arithmetic_with_memo,
      max_number_inputs,
      max_number_dicts
    );
    expect(n_inputs).toEqual(3);
    expect(n_buffers).toEqual(3);
    expect(op_buffers).toEqual([
      { sel_a: 0, sel_b: 1, op_code: 3 },
      { sel_a: 2, sel_b: 20, op_code: 4 },
      { sel_a: 20, sel_b: 21, op_code: 1 },
    ]);
    expect(inputs).toEqual([3, 2, 10]);
  });

  xit('should throw an error when the maximum number of inputs are exceeded', () => {});

  xit('should throw an error when the maximum number of buffers are exceeded', () => {});
});
