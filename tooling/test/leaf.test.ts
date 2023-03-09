import "mocha"
import { expect } from "chai"
import { Operator, ElementType, Function, parseFunction, Perceptible, FunctionElement } from '../src/types/Function'
import Leaf, { flattenLeaf, SimpleLeaf, unflattenLeaf, unwrapLeafToFunction, unwrapLeafToTree } from "../src/types/Leaf"
import { Direction } from "../src/types/Tree";

describe("flatten", () => {
    describe("leaf", () => {
        it("should flatten the leaf to an array", () => {
            // Given
            // f = (OPPONENT_BODY_STATE == 10) OR (OPPONENT_BODY_STATE == 20) OR (OPPONENT_BODY_STATE == 30)
            let f: Function = {
                elements: [
                    { value: Operator.OpenParenthesis, type: ElementType.Operator },
                    { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
                    { value: Operator.Equal, type: ElementType.Operator },
                    { value: 10, type: ElementType.Constant },
                    { value: Operator.CloseParenthesis, type: ElementType.Operator },
                    { value: Operator.Or, type: ElementType.Operator },
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
                ]
            }
            let leaf = parseFunction(f)
            // When 
            let got = flattenLeaf(leaf)
            // Then
            let expected = [
                1, 1, 5, 12, 1, 3, 14, -1, 1, 110, -1, -1, 10, -1, -1, 
                1, 1, 5, 12, 1, 3, 14, -1, 1, 110, -1, -1, 20, -1, -1,
                12, 1, 3, 14, -1, 1, 110, -1, -1, 30, -1, -1
            ]
            expect(got).deep.equal(expected)
        });
        it("should flatten the ABS function to the expected value", ()=> {
            // Given
            // f = Abs(SELF_X - OPPONENT_X) <= 80
            let f: Function = {
                elements: [
                    { value: Operator.OpenAbs, type: ElementType.Operator},
                    { value: Perceptible.SelfX, type: ElementType.Perceptible},
                    { value: Operator.Sub, type: ElementType.Operator},
                    { value: Perceptible.OpponentX, type: ElementType.Perceptible},
                    { value: Operator.CloseAbs, type: ElementType.Operator},
                    { value: Operator.Lte, type: ElementType.Operator},
                    { value: 80, type: ElementType.Constant},
                ]
            }
            let leaf = parseFunction(f)
            // When 
            let got = flattenLeaf(leaf)
            // Then
            let expected = [
                10, 1, 7, 6, -1, 1, 2, 1, 3, 14, -1, 1, 1, -1, -1, 14, -1, 1, 101, -1, -1, 80, -1, -1
            ]
            expect(got).deep.equal(expected)
        });
        it("should flatten the single ABS function to the correct value", () => {
            // Given
            // f = Abs(OPPONENT_VEL_X) <= 10
            let f: Function = {
                elements: [
                    { value: Operator.OpenAbs, type: ElementType.Operator},
                    { value: Perceptible.OpponentVelX, type: ElementType.Perceptible},
                    { value: Operator.CloseAbs, type: ElementType.Operator},
                    { value: Operator.Lte, type: ElementType.Operator},
                    { value: 10, type: ElementType.Constant},
                ]
            }
            let leaf = parseFunction(f)
            // When 
            let got = flattenLeaf(leaf)
            // Then
            let expected = [
                10, 1, 4, 6, -1, 1, 14, -1, 1, 103, -1, -1, 10, -1, -1
            ]
            expect(got).deep.equal(expected)
        })
        it("should flatten the combined ABS and AND functions to the correct value", () => {
            // Given
            // f = (OPPONENT_INT <= 300) AND (Abs(SELF_X - OPPONENT_X) <= 80)
            let f: Function = {
                elements: [
                    { value: Operator.OpenParenthesis, type: ElementType.Operator},
                    { value: Perceptible.OpponentInt, type: ElementType.Perceptible},
                    { value: Operator.Lte, type: ElementType.Operator},
                    { value: 300, type: ElementType.Constant},
                    { value: Operator.CloseParenthesis, type: ElementType.Operator},
                    { value: Operator.And, type: ElementType.Operator},
                    { value: Operator.OpenParenthesis, type: ElementType.Operator},
                    { value: Operator.OpenAbs, type: ElementType.Operator},
                    { value: Perceptible.SelfX, type: ElementType.Perceptible},
                    { value: Operator.Sub, type: ElementType.Operator},
                    { value: Perceptible.OpponentX, type: ElementType.Perceptible},
                    { value: Operator.CloseAbs, type: ElementType.Operator},
                    { value: Operator.Lte, type: ElementType.Operator},
                    { value: 80, type: ElementType.Constant},
                    { value: Operator.CloseParenthesis, type: ElementType.Operator},
                ]
            }
            let leaf = parseFunction(f)
            // When 
            let got = flattenLeaf(leaf)
            // Then
            let expected = [
                3, 1, 5, 10, 1, 3, 14, -1, 1, 108, -1, -1, 300, -1, -1,
                10, 1, 7, 6, -1, 1, 2, 1, 3, 14, -1, 1, 1, -1, -1, 14, -1, 1, 101, -1, -1,
                80, -1, -1
            ]
            expect(got).deep.equal(expected)
        })
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
            let got = unwrapLeafToTree(leaf)
            // Then
            let expected = [
                    { id: 'if F0', isChild: false },
                    { id: 'MS 0', isChild: true, branch: Direction.Left },
                    { id: 'MS 1', isChild: true, branch: Direction.Right },
            ]
            
            expect(got).deep.equal(expected)
        }) 
    });
});