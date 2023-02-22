//@ts-ignore
import { groth16 } from 'snarkjs';
import path from 'path';
//@ts-ignore
import { wasm as wasm_tester } from 'circom_tester';

//@ts-ignore
import { F1Field, Scalar } from 'ffjavascript';

//@ts-ignore
import { buildBabyjub } from 'circomlibjs';

function getBits(v: Scalar, n = 254) {
  const res = [];
  for (let i = 0; i < n; i++) {
    if (Scalar.isOdd(Scalar.shr(v, i))) {
      res.push(Fr.one);
    } else {
      res.push(Fr.zero);
    }
  }
  return res;
}

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

describe('FD Emulator Circuit test', () => {
  it.only('Test basic FD function', async () => {
    const circuit = await load_FD_circuit();
    // 2 buffers, 5 inputs, 5 conditionals, 32 size words
    const INPUT = {
      next_state: [1, 2, 3, 4, 5], // Match to each conditional, 5 is default
      inputs: [10, 20, 30, 40, 50, 60],
      conditional_mux_sel: [
        [0, 1], // <=
        [0, 0], // ==
        [1, 0], // <
      ],
      conditional_inputs_mux_sel: [
        [2, 1], // 30 <= 20
        [2, 3], // 30 == 40
        [3, 4], // 40 < 50 (Checks out!)
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
      conditionals_to_state_selectors: [
        0, // 30 <= 20
        1, // 30 == 40
        3, // 30 <= 20 && 40 < 50
        4, // 30 == 40 || 40 < 50
      ],
      cond_buffer_mux_sel: [
        [0, 2],
        [1, 2],
        [0, 0],
      ],
      cond_buffer_type_sel: [
        0, // &&
        1, // ||
        0, // &&
      ],
    };

    const witness = await circuit.calculateWitness(INPUT, true);
    circuit.assertOut(witness, { selected_next: Fr.e(4) });
  });

  it('Test abs valuing', async () => {
    const circuit = await load_FD_circuit();
    const inps = ['-10', '10', '30', '40', '50'];
    // 2 buffers, 5 inputs, 5 conditionals, 32 size words
    const INPUT = {
      next_state: [1, 2, 3, 4, 5, 6], // Match to each conditional
      inputs: inps,
      conditional_mux_sel: [
        [0, 0], // ==
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      conditional_inputs_mux_sel: [
        [5, 1], // |-10| == 10
        [2, 3], // 30 == 40
        [3, 4], // 40 \leq 50 (Checks out!)
        [4, 5], // 50 != 230
        [5, 6], // 230 < 950 ],
      ],
      buffer_mux_sel: [
        [0, 2, 0], // calculate |-10|
        [2, 2, 4], // Calculate 30 * 30 + 50
        [2, 2, 4], // Calculate 30 * 30 + 50 // TODO: NOTE BUFFER INPUTS CANNOT BE 0
      ],
      buffer_type_sel: [
        [1, 0], // absolute value of -10
        [0, 0],
        [0, 0],
      ],
      // Bypass all ands
      and_selectors: [
        [0, 5, 5], // 6 is the false preset
        [1, 5, 5],
        [2, 5, 5],
        [3, 5, 5],
        [4, 5, 5],
      ],
    };

    const witness = await circuit.calculateWitness(INPUT, true);
    circuit.assertOut(witness, { selected_next: Fr.e(1) });
  });

  it('Test default return upon condition not met', async () => {
    const circuit = await load_FD_circuit();
    // 2 buffers, 5 inputs, 5 conditionals, 32 size words
    const INPUT = {
      next_state: [1, 2, 3, 4, 5, 6], // Match to each conditional
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
      // Bypass all ands
      and_selectors: [
        [0, 5, 6], // 6 is the false preset
        [1, 5, 6],
        [2, 5, 6],
        [3, 5, 6],
        [4, 5, 6],
      ],
    };

    const witness = await circuit.calculateWitness(INPUT, true);
    circuit.assertOut(witness, { selected_next: Fr.e(6) });
  });

  it('Test And-ing different conditionals', async () => {
    const circuit = await load_FD_circuit();
    const INPUT = {
      next_state: [1, 2, 21, 211, 2111, 5], // Match to each conditional
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
        [2, 3], // 21 ?== 21 (false)
        [3, 4], // 211 < 2111 (true)
        [4, 5], // 2111 != (21 // 5)
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
      and_selectors: [
        [0, 1, 5], // and 0 and 1, should be false
        [0, 2, 3], // should be true
        [2, 5, 5],
        [3, 5, 5],
        [4, 5, 5],
      ],
    };
    const witness = await circuit.calculateWitness(INPUT, true);
    circuit.assertOut(witness, { selected_next: Fr.e(2) });
  });

  it('Test buffer divide mod', async () => {
    const circuit = await load_FD_circuit();
    const INPUT = {
      next_state: [1, 2, 21, 211, 2111, 5], // Match to each conditional
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
        [0, 1], // a // b
        [1, 1], // a % b
        [0, 0], // r1cs
      ],
      and_selectors: [
        [0, 5, 5],
        [1, 5, 5],
        [2, 5, 5],
        [3, 5, 5],
        [4, 5, 5],
      ],
    };
    const witness = await circuit.calculateWitness(INPUT, true);
    circuit.assertOut(witness, { selected_next: Fr.e(1) });
  });
});
