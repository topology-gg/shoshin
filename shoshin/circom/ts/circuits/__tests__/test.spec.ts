//@ts-ignore
import { groth16 } from 'snarkjs';
import path from 'path';
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
  let circuit: any = null;
  beforeAll(async () => {});

  it('Test basic FD function', async () => {
    circuit = await wasm_tester(
      path.join(__dirname, 'circuits', 'fd_tester.circom')
    );
    await circuit.loadConstraints();
    // 2 buffers, 5 inputs, 5 conditionals, 32 size words
    const INPUT = {
      next_state: [1, 2, 3, 4, 5], // Match to each conditional
      inputs: [10, 20, 30, 40, 50],
      conditional_mux_sel: [
        [0, 1],
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      conditional_inputs_mux_sel: [
        [2, 1], // 30 < 20
        [2, 3], // 30 == 40
        [3, 4], // 40 \leq 50 (Checks out!)
        [4, 5], // 50 != 230
        [5, 6], // 230 < 950 ],
      ],
      buffer_mux_sel: [
        [0, 1, 2], // Calculate 10 * 20 + 30
        [2, 2, 4], // Calculate 30 * 30 + 50
        [2, 2, 4], // Calculate 30 * 30 + 50
      ],
      buffer_type_sel: [
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    };

    const witness = await circuit.calculateWitness(INPUT, true);
    circuit.assertOut(witness, { selected_next: Fr.e(3) });
  });

  it('Test buffer divide mod', async () => {
    circuit = await wasm_tester(
      path.join(__dirname, 'circuits', 'fd_tester.circom')
    );
    await circuit.loadConstraints();
    // TODO: !!!! I DO NOT HAVE AND OR OR's as operations yet...
    const INPUT = {
      next_state: [1, 2, 21, 211, 2111], // Match to each conditional
      inputs: [1, 21, 5, 40, 50],
      conditional_mux_sel: [
        [0, 0], // ==
        [0, 0], // ==
        [1, 0], // <
        [1, 1], // !=
        [0, 1], // <=
      ],
      conditional_inputs_mux_sel: [
        [1, 7], // check that `buffer 3` == `input 1`
        [2, 3], // dummy...
        [3, 4], // dummy...
        [4, 5], // dummy...
        [5, 6], // dummy...
      ],
      buffer_mux_sel: [
        [1, 2, 0], // Calculate 21 // 5 = 4
        [1, 2, 0], // Calculate 21 % 5 = 1
        [2, 5, 6], // Calculate (a//b) * b + r
      ],
      buffer_type_sel: [
        [0, 1], // a // b // TODO: NOTE DOWN THE REVERSE ORDER!!!! I.e. this is 2
        [1, 1], // a % b
        [0, 0], // r1cs
      ],
    };
    const witness = await circuit.calculateWitness(INPUT, true);
    circuit.assertOut(witness, { selected_next: Fr.e(1) });
  });
});
