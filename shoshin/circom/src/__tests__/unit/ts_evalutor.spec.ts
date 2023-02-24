import { ts_dag_evaluator } from '../../ts_evaluator';
import {
  dag_arithmetic,
  dag_arithmetic_with_memo,
  dag_simple,
} from './dag_test_common';

describe('TypeScript dag evaluation', () => {
  it('should evaluate a simple dag and give the output value', () => {
    const out = ts_dag_evaluator(dag_simple, []);
    expect(out).toEqual(BigInt(0));
  });

  it('should evaluate a simple arithmetic DAG', () => {
    const out = ts_dag_evaluator(dag_arithmetic, []);
    expect(out).toEqual(BigInt(9));
  });

  it('should evaluate a simple non tree arithmetic DAG', () => {
    const out = ts_dag_evaluator(dag_arithmetic_with_memo, []);
    console.log(`OUT OF ${out}`);
    expect(out).toEqual(BigInt(7));
  });

  xit('should evaluate a tree with a dict', () => {});
});
