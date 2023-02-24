import { ts_dag_evaluator } from '../../ts_evaluator';
import { dag_arithmetic, dag_simple } from './dag_test_common';

describe.only('TypeScript dag evaluation', () => {
  it('should evaluate a simple dag and give the output value', () => {
    const out = ts_dag_evaluator(dag_simple);
    expect(out).toEqual(BigInt(0));
  });
  it('should evaluate a simple arithmetic DAG', () => {
    const out = ts_dag_evaluator(dag_arithmetic);
    expect(out).toEqual(BigInt(9));
  });
  xit('should throw an error when the maximum number of buffers are exceeded', () => {});
});
