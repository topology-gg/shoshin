import { ts_dag_evaluator } from '../../ts_evaluator';
import { dag_to_circom } from '../../compile/json_compiler';

import path from 'path';
//@ts-ignore
import { wasm as wasm_tester } from 'circom_tester';

//@ts-ignore
import { Scalar } from 'ffjavascript';

//@ts-ignore
import {
  gen_random_dag_collection,
  gen_random_dag,
} from './random_program_utils';
import { CircomCompilerOutInfo } from '../../types';
import { gen_fd_proof_inputs } from '../../fd_proof_artifact_gen';
import { gen_merkle_tree } from '../../fd_merkle_tree';
import { gen_circom_randomness } from '../../utils';

const N_MIND_STATES = 8;
const MAX_CONSTANTS = 4;
const MAX_DICT = 4;
const MAX_TRACE = 30;

const p = Scalar.fromString(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);

const load_FD_Wrapper_circuit = async () => {
  const p = path.join(
    __dirname,
    '../../../circuits/__tests__/circuits',
    'fd_wrapper_tester.circom'
  );
  const circuit = await wasm_tester(p);
  await circuit.loadSymbols();
  await circuit.loadConstraints();
  return circuit;
};

const load_FD_Emulator_circuit = async () => {
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

/**
 * Create random DAGs and ensure that the Circom's output equals to that of the TS Emulator
 */
describe('random DAG tests for only FD Emulator', () => {
  it(
    'Should test 100 fuzzing samples of smallish circuits',
    async () => {
      const n_tests = 100; // On a Thinkpad laptop, we estimate each takes ~6 seconds. So 100 tests takes ~10
      let n_test_run = 0;
      while (n_test_run < n_tests) {
        // We need to reload the circuit or we get odd errors
        const circuit = await load_FD_Emulator_circuit();
        const max_n_traces_fuzzing = 1000;
        const { dag, dict } = gen_random_dag(
          MAX_CONSTANTS,
          MAX_DICT,
          max_n_traces_fuzzing
        );
        const {
          n_inputs,
          n_traces,
          op_traces,
          inputs_constant,
          dict: dict_padded,
          compiler_info,
        } = dag_to_circom(dag, dict, MAX_CONSTANTS, MAX_DICT, MAX_TRACE);
        // console.log(dag, dict, op_traces);
        if (
          n_inputs <= MAX_CONSTANTS + MAX_DICT &&
          inputs_constant.length <= MAX_CONSTANTS &&
          n_traces < MAX_TRACE &&
          !compiler_info?.includes(CircomCompilerOutInfo.TRUNCATED_DICT) &&
          !compiler_info?.includes(CircomCompilerOutInfo.TRUNCATED_TRACES)
        ) {
          n_test_run += 1;
          const ts_out = ts_dag_evaluator(dag, dict);

          const all_inps = inputs_constant.concat(dict_padded);

          const circ_input = {
            inputs: all_inps,
            trace_inp_selectors: op_traces.map(o => [o.sel_a, o.sel_b]),
            trace_type_selectors: op_traces.map(o => o.op_code),
          };
          const witness = await circuit.calculateWitness(circ_input, true);
          if (ts_out.valueOf() < BigInt(0).valueOf()) {
            // remove the negative as the output of circom is not negative
            // but rather works over the unsigned ints
            circuit.assertOut(witness, { out: p + ts_out.valueOf() });
          } else {
            circuit.assertOut(witness, { out: ts_out.valueOf() });
          }
          // We need to call a Jest test in order to keep the For Loop Going
          expect(1).toEqual(1);
        }
      }
      console.log(`Successfully ran ${n_test_run} tests`);
    },
    60000 * 20 // twenty minutes for the testing
  );
});

describe('random DAG tests for FD Emulator and Wrapper', () => {
  it(
    'Should test all FDs for a given mind',
    async () => {
      // We need to reload the circuit or we get odd errors
      const max_n_traces_fuzzing = 1000;
      const fds = gen_random_dag_collection(
        N_MIND_STATES,
        MAX_CONSTANTS,
        MAX_DICT,
        max_n_traces_fuzzing,
        MAX_CONSTANTS,
        MAX_DICT,
        MAX_TRACE
      );

      const fds_circom = fds.map(f =>
        dag_to_circom(f.dag, f.dict, MAX_CONSTANTS, MAX_DICT, MAX_TRACE)
      );

      const fds_circom_with_randomness = await Promise.all(
        fds_circom.map(async fd => {
          return { fd, randomness: await gen_circom_randomness() };
        })
      );

      const n_levels = Math.ceil(Math.log2(N_MIND_STATES)) + 1;
      const merkle_tree = await gen_merkle_tree(
        fds_circom_with_randomness,
        n_levels
      );

      for (let i = 0; i < N_MIND_STATES; i++) {
        const { dag, dict } = fds[i];
        const mind = i;
        const mind_randomness = await gen_circom_randomness();
        const fd_randomness = fds_circom_with_randomness[i].randomness;
        const circom_inp = await gen_fd_proof_inputs(
          merkle_tree,
          dag,
          dict,
          mind,
          mind_randomness,
          fd_randomness,
          MAX_CONSTANTS,
          MAX_DICT,
          MAX_TRACE
        );

        const circuit = await load_FD_Wrapper_circuit();
        const witness = await circuit.calculateWitness({ ...circom_inp }, true);
        circuit.assertOut(witness, { out: 1 });
      }
    },
    60000 * 20 // twenty minutes for the testing
  );
});
