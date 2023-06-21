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

export enum OpCodes {
  ADD = 1,
  SUB = 2,
  MUL = 3,
  DIV = 4,
  // MOD = 5,
  ABS = 6,
  // SQRT = 7,
  // POW = 8,

  IS_NN = 9,
  IS_LE = 10,
  NOT = 11,
  EQ = 12,

  // MEM = 13,
  DICT = 14,
  // FUNC = 15,
}

describe('FD Emulator Circuit test', () => {
  it("Test basic FD function for sanity's sake", async () => {
    const circuit = await load_FD_circuit();
    // Compute abs(-10) + (30 / -10) = 7
    // 3 traces, 6 inputs
    const INPUT = {
      inputs: [-10, 20, 30, 40, 50, 60, 0, 0],
      trace_inp_selectors: [
        [0, 1],
        [2, 0],
        [8, 9],
        [10, 0],
        [11, 0],
        [12, 0],
        [13, 0],
        [14, 0],
        [15, 0],
        [16, 0],
        [17, 0],
        [18, 0],
        [19, 0],
        [20, 0],
        [21, 0],
        [22, 0],
        [23, 0],
        [24, 0],
        [25, 0],
        [26, 0],
        [27, 0],
        [28, 0],
        [29, 0],
        [30, 0],
        [31, 0],
        [32, 0],
        [33, 0],
        [34, 0],
        [35, 0],
        [36, 0],
      ],
      trace_type_selectors: [
        OpCodes.ABS,
        OpCodes.DIV,
        OpCodes.ADD,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
    };

    const witness = await circuit.calculateWitness(INPUT, true);
    circuit.assertOut(witness, { out: Fr.e(7) });
  });
});
