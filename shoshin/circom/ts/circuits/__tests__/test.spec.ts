//@ts-ignore
import { groth16 } from 'snarkjs';
import path from 'path'
//@ts-ignore
import { wasm as wasm_tester } from 'circom_tester';

//@ts-ignore
import { F1Field, Scalar } from 'ffjavascript';

const p = Scalar.fromString(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);
const Fr = new F1Field(p);

// TODO: put into a common lib... also means we hae to convert this function to ts

describe('FD VM Circuit test', () => {
  it('Test basic FD function', async () => {
    console.log("WE GOT", __dirname)
    const circuit = await wasm_tester(
      path.join(__dirname, 'circuits', 'fd_tester.circom')
    );
    await circuit.loadConstraints();

    const INPUT = {
      program: [],
      inputs: [],
    };

    const witness = await circuit.calculateWitness(INPUT, true);
    circuit.assertOut(witness, { next_mind: Fr.e(42), next_intent: Fr.e(42) });
  });
});
