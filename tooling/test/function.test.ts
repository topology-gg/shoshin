import "mocha"
import { expect } from "chai"
import { Operator, ElementType, Condition, parseConditionToLeaf, Perceptible } from '../src/types/Condition'

describe("parse", () => {
    describe("function", () => {
        it("should parse the OR functions to the expected result", () => {
            // Given
            // f = (OPPONENT_BODY_STATE == 10) OR (OPPONENT_BODY_STATE == 20) OR (OPPONENT_BODY_STATE == 30)
            let f: Condition = {
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
            // When 
            let got = parseConditionToLeaf(f)
            // Then
            let expected = {
                value: 1, 
                left: {
                    value: 12, 
                    left: {value: 14, left: -1, right: {value: 110, left: -1, right: -1}}, 
                    right: {value: 10, left: -1, right: -1},
                },
                right: {
                    value: 1, 
                    left: {
                        value: 12, 
                        left: {value: 14, left: -1, right: {value: 110, left: -1, right: -1}}, 
                        right: {value: 20, left: -1, right: -1},
                    },
                    right: {
                        value: 12, 
                        left: {value: 14, left: -1, right: {value: 110, left: -1, right: -1}}, 
                        right: {value: 30, left: -1, right: -1},
                    }
                }
            }
            expect(got).deep.equal(expected)
        });
        it("should parse the ABS function to the expected value", ()=> {
            // Given
            // f = Abs(SELF_X - OPPONENT_X) <= 80
            let f: Condition = {
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
            // When 
            let got = parseConditionToLeaf(f)
            // Then
            let expected = {
                value: 10,
                left: {
                    value: 6, 
                    left: -1,
                    right: {
                        value: 2, 
                        left: {value: 14, left: -1, right: {value: 1, left: -1, right: -1}}, 
                        right: {value: 14, left: -1, right: {value: 101, left: -1, right: -1}}, 
                    }
                },
                right: {value: 80, left: -1, right: -1},
            }
            expect(got).deep.equal(expected)
        });
        it("should parse the single ABS function to the correct value", () => {
            // Given
            // f = Abs(OPPONENT_VEL_X) <= 10
            let f: Condition = {
                elements: [
                    { value: Operator.OpenAbs, type: ElementType.Operator},
                    { value: Perceptible.OpponentVelX, type: ElementType.Perceptible},
                    { value: Operator.CloseAbs, type: ElementType.Operator},
                    { value: Operator.Lte, type: ElementType.Operator},
                    { value: 10, type: ElementType.Constant},
                ]
            }
            // When 
            let got = parseConditionToLeaf(f)
            // Then
            let expected = {
                value: 10,
                left: {
                    value: 6, 
                    left: -1,
                    right: {value: 14, left: -1, right: {value: 103, left: -1, right: -1}}, 
                },
                right: {value: 10, left: -1, right: -1},
            }
            expect(got).deep.equal(expected)
        })
        it("should parse the combined ABS and AND functions to the correct value", () => {
            // Given
            // f = (OPPONENT_INT <= 300) AND (Abs(SELF_X - OPPONENT_X) <= 80)
            let f: Condition = {
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
            // When
            let got = parseConditionToLeaf(f)
            // Then
            let expected = {
                value: 3, 
                left: {
                    value: 10, 
                    left: {value: 14, left: -1, right: {value: 108, left: -1, right: -1}}, 
                    right: {value: 300, left: -1, right: -1},
                },
                right: {
                    value: 10,
                    left: {
                        value: 6, 
                        left: -1,
                        right: {
                            value: 2, 
                            left: {value: 14, left: -1, right: {value: 1, left: -1, right: -1}}, 
                            right: {value: 14, left: -1, right: {value: 101, left: -1, right: -1}}, 
                        }
                    },
                    right: {value: 80, left: -1, right: -1},
                }
            }
            expect(got).deep.equal(expected)
        })
    });
    it("should parse the three level parenthesis example into the expected result", () => {
        // Given
        //f = 10 * (Abs(OPPONENT_ACC_X) + 3 * (SELF_X + SELF_Y * (10 + OPPONENT_INT)))
        let f: Condition = {
            elements: [
                { value: 10, type: ElementType.Constant},
                { value: Operator.Mul, type: ElementType.Operator},
                { value: Operator.OpenParenthesis, type: ElementType.Operator},
                { value: Operator.OpenAbs, type: ElementType.Operator},
                { value: Perceptible.OpponentAccX, type: ElementType.Perceptible},
                { value: Operator.CloseAbs, type: ElementType.Operator},
                { value: Operator.Add, type: ElementType.Operator},
                { value: 3, type: ElementType.Constant},
                { value: Operator.Mul, type: ElementType.Operator},
                { value: Operator.OpenParenthesis, type: ElementType.Operator},
                { value: Perceptible.SelfX, type: ElementType.Perceptible},
                { value: Operator.Add, type: ElementType.Operator},
                { value: Perceptible.SelfY, type: ElementType.Perceptible},
                { value: Operator.Mul, type: ElementType.Operator},
                { value: Operator.OpenParenthesis, type: ElementType.Operator},
                { value: 10, type: ElementType.Constant},
                { value: Operator.Add, type: ElementType.Operator},
                { value: Perceptible.OpponentInt, type: ElementType.Perceptible},
                { value: Operator.CloseParenthesis, type: ElementType.Operator},
                { value: Operator.CloseParenthesis, type: ElementType.Operator},
                { value: Operator.CloseParenthesis, type: ElementType.Operator},
            ]
        }
        // When
        let got = parseConditionToLeaf(f)
        // Then
        let expected = {
            value: 3,
            left: {value: 10, left: -1, right: -1},
            right: {
                value: 1,
                left: {
                    value: 6,
                    left: -1,
                    right: {value: 14, left: -1, right: {value: 105, left: -1, right: -1}}
                },
                right: {
                    value: 3,
                    left: {value: 3, left: -1, right: -1},
                    right: {
                        value: 1,
                        left: {value: 14, left: -1, right: {value: 1, left: -1, right: -1}},
                        right: {
                            value: 3,
                            left: {value: 14, left: -1, right: {value: 2, left: -1, right: -1}},
                            right: {
                                value: 1, 
                                left: {value: 10, left: -1, right: -1},
                                right: {value: 14, left: -1, right: {value: 108, left: -1, right: -1}}
                            }
                        }
                    }
                }
            }
        }
        expect(got).deep.equal(expected)
    })
});