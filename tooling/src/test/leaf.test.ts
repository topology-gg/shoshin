import "mocha";
import { expect } from "chai";
import Leaf, { SimpleLeaf, flattenLeaf, unflattenLeaf, unwrapLeafToFunction, unwrapLeafToTree } from "../types/Leaf";
import { ElementType, FunctionElement, functionToStr, Operator, Perceptible } from "../types/Function";
import { Direction } from "../types/Tree";


describe("flatten", () => {
    describe("leaf", () => {
        it("should flatten the leaf to the correct value", () => {
            // Given
            let leaf: Leaf = {value: 6, left: -1, right: {value: 2, left: {value: 14, left: -1, right: 1}, right: {value: 14, left: -1, right: 101}}}
            // When 
            let got = flattenLeaf(leaf)
            // Then
            let expected = [6, -1, 1, 2, 1, 3, 14, -1, 1, 1, -1, -1, 14, -1, 1, 101, -1, -1]
            expect(got).deep.equal(expected)
        });
    });
});

describe("unflatten", () => {
    describe("simple leaf", () => {
        it("should unflatten the simple leaf to the correct value", () => {
            // Given
            let leaf: SimpleLeaf[] = [
                {value: 6, left:-1, right: 1}, {value: 2, left: 1, right: 3}, 
                {value: 14, left: -1, right: 1}, {value: 1, left: -1, right: -1},
                {value: 14, left:-1, right: 1}, {value: 101, left: -1, right: -1}
            ]
            // When
            let got = unflattenLeaf(leaf)
            // Then
            let expected: Leaf = {
                value: 6, 
                left: -1, 
                right: {
                    value: 2, 
                    left: {
                        value: 14, 
                        left: -1, 
                        right: {value: 1, left: -1, right: -1}
                    }, 
                    right: {
                        value: 14, 
                        left: -1, 
                        right: {value: 101, left: -1, right: -1},
                    }
                }}
            expect(got).deep.equal(expected)
        });
    });
});

describe("unwrap", () => {
    describe("leaf", () => {
        it("should unwrap the leaf into the expected function", () => {
            // Given
            let leaf: Leaf = {
                value: 1, 
                left: {
                    value: 12, 
                    left: { value: 14, left: -1, right: {value: 110, left: -1, right: -1}}, 
                    right: {value: 10, left: -1, right: -1}
                }, 
                right: {
                    value: 1, 
                    left: {
                        value: 12, 
                        left: { value: 14, left: -1, right: {value: 110, left: -1, right: -1}}, 
                    right: {value: 20, left: -1, right: -1}
                    },
                    right: {
                        value: 12, 
                        left: { value: 14, left: -1, right: {value: 110, left: -1, right: -1}}, 
                    right: {value: 30, left: -1, right: -1}
                    },
                }}
            // When
            let got = unwrapLeafToFunction(leaf).slice(1, -1)
            // Then
            let expected: FunctionElement[] = [
                { value: Operator.OpenParenthesis, type: ElementType.Operator },
                { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
                { value: Operator.Equal, type: ElementType.Operator },
                { value: 10, type: ElementType.Constant },
                { value: Operator.CloseParenthesis, type: ElementType.Operator },
                { value: Operator.Or, type: ElementType.Operator },
                { value: Operator.OpenParenthesis, type: ElementType.Operator },
                { value: Operator.OpenParenthesis, type: ElementType.Operator },
                { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
                { value: Operator.Equal, type: ElementType.Operator },
                { value: 20, type: ElementType.Constant },
                { value: Operator.CloseParenthesis, type: ElementType.Operator },
                { value: Operator.Or, type: ElementType.Operator },
                { value: Operator.OpenParenthesis, type: ElementType.Operator },
                { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
                { value: Operator.Equal, type: ElementType.Operator },
                { value: 30, type: ElementType.Constant },
                { value: Operator.CloseParenthesis, type: ElementType.Operator },
                { value: Operator.CloseParenthesis, type: ElementType.Operator },
            ]
            expect(got).deep.equal(expected)
        });
        it("should unwrap the leaf into the expected tree", () => {
            // Given
            let leaf: Leaf = {
                value: 1,
                left: {
                    value: 3,
                    left: {
                        value: 15,
                        left: -1,
                        right: {value: 0, left: -1, right: -1},
                    },
                    right: {value: 0, left: -1, right: -1},
                },
                right: {
                    value: 3,
                    left: {
                        value: 2,
                        left: 1,
                        right: {
                            value: 13, 
                            left: -1, 
                            right: {value: 0, left: -1, right: -1},
                        }
                    },
                    right: {
                        value: 1,
                        left: -1,
                        right: -1,
                    }
                }
            }
            // When
            let got = unwrapLeafToTree(leaf, 9)
            // Then
            let expected = [
                    { id: 'if F9', isChild: false },
                    { id: 'MS 0', isChild: true, branch: Direction.Left },
                    { id: 'MS 1', isChild: true, branch: Direction.Right },
            ]
            
            expect(got).deep.equal(expected)
        }) 
    });
});