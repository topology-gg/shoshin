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

const p = Scalar.fromString(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);
const Fr = new F1Field(p);

const load_FD_circuit = async () => {
  const circuit = await wasm_tester(
    path.join(__dirname, 'circuits', 'fd_emulator_tester.circom')
  );
  await circuit.loadSymbols();
  await circuit.loadConstraints();
  return circuit;
};

describe('fuzzing tests', () => {
  it('Should test fuzzing of small circuits', () => {
    const max_n_constants = 20;
    const max_n_dict = 20;
    const max_n_traces = 30;
    const { dag, dict } = gen_random_dag(
      max_n_constants,
      max_n_dict,
      max_n_traces
    );
    console.log(dag, dict);
    const ts_out = ts_dag_evaluator(dag, dict);
    console.log('Output', ts_out);
    // TODO: hmmmm... what if we get division by 0?
  });
});

// Hmmmmm
// [
//     [ -332, -1, -1 ],
//     [ 4, 0, 1 ],
//     [ 14, -1, 0 ],
//     [ 14, -1, 0 ],
//     [ 3, 4, 2 ]
//   ] [ -94, -414 ]
