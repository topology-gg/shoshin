import { ts_dag_evaluator } from '../../ts_evaluator';
import { dag_to_circom } from '../../compile/json_compiler';

//@ts-ignore
import { groth16 } from 'snarkjs';
import path from 'path';
//@ts-ignore
import { wasm as wasm_tester } from 'circom_tester';

//@ts-ignore
import { F1Field, Scalar } from 'ffjavascript';

//@ts-ignore
import { buildBabyjub } from 'circomlibjs';
import { gen_random_dag } from './fuzzing_utils';
import { pad_array_to_len } from '../../utils';

const MAX_CONSTANTS = 4;
const MAX_DICT = 4;
const MAX_TRACE = 30;

const p = Scalar.fromString(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);
const Fr = new F1Field(p);

const load_FD_circuit = async () => {
  const p = path.join(
    __dirname,
    '../../../circuits/__tests__/circuits',
    'fd_emulator_tester.circom'
  );
  const circuit = await wasm_tester(p);
  await circuit.loadSymbols();
  await circuit.loadConstraints();
  return circuit;
};

describe('fuzzing tests', () => {
  it('Should test 100 fuzzing samples of smallish circuits', async () => {
    const n_tests = 10;
    let n_test_run = 0;
    const circuit = await load_FD_circuit();
    for (let i = 0; i < n_tests; i++) {
      const max_n_traces_fuzzing = 1000;
      const { dag, dict } = gen_random_dag(
        MAX_CONSTANTS,
        MAX_DICT,
        max_n_traces_fuzzing
      );
      const ts_out = ts_dag_evaluator(dag, dict);
      const { n_inputs, n_traces, op_traces, inputs_constant } = dag_to_circom(
        dag,
        MAX_CONSTANTS,
        MAX_DICT
      );
      if (
        n_inputs <= MAX_CONSTANTS + MAX_DICT &&
        inputs_constant.length <= MAX_CONSTANTS &&
        n_traces < MAX_TRACE
      ) {
        n_test_run += 1;

        const dict_padded = pad_array_to_len(dict, MAX_DICT, 0);
        const all_inps = inputs_constant.concat(dict_padded);
        const traces_padded = pad_array_to_len(op_traces, MAX_TRACE, {
          op_code: 0,
          sel_a: 0,
          sel_b: 0,
        });

        const circ_input = {
          inputs: all_inps,
          trace_inp_selectors: traces_padded.map(o => [o.sel_a, o.sel_b]),
          trace_type_selectors: traces_padded.map(o => o.op_code),
        };
        const witness = await circuit.calculateWitness(circ_input, true);
        circuit.assertOut(witness, { out: ts_out.valueOf() });
        // We need to call a Jest test in order to keep the For Loop Going
        expect(1).toEqual(1);
      }
      console.log(`Successfully ran ${n_test_run}`);
    }
  });
});
