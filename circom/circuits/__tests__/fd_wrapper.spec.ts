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
    path.join(__dirname, 'circuits', 'fd_wrapper_tester.circom')
  );
  await circuit.loadSymbols();
  await circuit.loadConstraints();
  return circuit;
};

describe('FD Emulator Circuit test', () => {
  xit('Test basic FD Emulator function', async () => {});

  xit('Test giving an invalid FD commitment', async () => {});

  xit('Test giving an invalid next mind commitment', async () => {});

  xit('Test giving an invalid current mind commitment', async () => {});

  xit('Test a more complicated, compiled circuit', async () => {});
});
