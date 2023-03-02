import { gen_random_dag } from './random_program_utils';
import { dag_to_circom } from '../../compile/json_compiler';
import { gen_merkle_tree, get_merkle_tree_proof } from '../../fd_merkle_tree';
import { gen_circom_randomness } from '../../utils';
import { CircomCanonicalFD } from '../../types';
import path from 'path';

//@ts-ignore
import { wasm as wasm_tester } from 'circom_tester';
//@ts-ignore
import { Scalar, F1Field } from 'ffjavascript';

const N_MAX_CONSTANTS = 3;
const N_MAX_DICT = 3;
const N_MAX_TRACE = 10;
const N_MIND_STATES = 8;

const p = Scalar.fromString(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);
const Fr = new F1Field(p);

const load_circuit = async () => {
  const p = path.join(
    __dirname,
    '../../../circuits/__tests__/circuits',
    'fd_merkle_tester.circom'
  );
  const circuit = await wasm_tester(p);
  await circuit.loadSymbols();
  await circuit.loadConstraints();
  return circuit;
};

describe('TypeScript merkle tree evaluation', () => {
  it(
    'should evaluate create a merkle tree based on a set of dags and check memberships. Expect proper evaluation',
    async () => {
      const circom_dags = Array(N_MIND_STATES)
        .fill(0)
        .map((_, i) => {
          const { dag, dict } = gen_random_dag(
            N_MAX_CONSTANTS,
            N_MAX_DICT,
            N_MAX_TRACE
          );
          return {
            fd: dag_to_circom(
              dag,
              dict,
              N_MAX_CONSTANTS,
              N_MAX_DICT,
              N_MAX_TRACE
            ) as CircomCanonicalFD,
            randomness: gen_circom_randomness(),
          };
        });
      const tree = await gen_merkle_tree(
        circom_dags,
        Math.log2(N_MIND_STATES) + 1
      );
      console.log(
        `Have merkle tree with root ${tree[1]} and length ${tree.length}`
      );
      for (let i = 0; i < 8; i++) {
        const circuit = await load_circuit();
        const elem = tree[N_MIND_STATES + i];
        const { sibling_pos, siblings } = get_merkle_tree_proof(tree, i);
        const circ_input = {
          elem,
          root: tree[1],
          siblings,
          sibling_positions: sibling_pos,
        };
        const witness = await circuit.calculateWitness(circ_input, true);
        circuit.assertOut(witness, { out: 1 });
      }

      // Test that the circuit rejects an invalid root
      const circ_input = {
        elem: gen_circom_randomness(),
        root: tree[1],
        siblings: Array(3).fill(0n),
        sibling_positions: Array(3).fill(0),
      };
      const circuit = await load_circuit();
      const witness = await circuit.calculateWitness(circ_input, true);
      // remove the negative as the output of circom is not negative
      // but rather works over the unsigned ints
      circuit.assertOut(witness, { out: 0 });

      expect(1).toEqual(1);
    },
    60 * 1000 // 1 minute
  );
});
