import { ts_tree_evaluator } from '../../ts_evaluator';
import { tree_simple } from './tree_test_common';

describe.only('TypeScript tree evaluation', () => {
  it('should evaluate a simple tree and give the output value', () => {
    const out = ts_tree_evaluator(tree_simple);
    expect(out).toEqual(BigInt(0));
  });
  xit('should throw an error when the maximum number of inputs are exceeded', () => {});
  xit('should throw an error when the maximum number of buffers are exceeded', () => {});
});
