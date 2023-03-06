import "mocha"
import { expect } from "chai"
import { Operator, ElementType, Function, parseFunction, Perceptible } from '../src/types/Function'
import { flattenN } from "../src/types/Leaf"

describe("flatten", () => {
    describe("leaf", () => {
        it("should flatten the leaf to an array", () => {
            // Given
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
            let got = flattenN(leaf)
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
            let got = flattenN(leaf)
            // Then
            let expected = [
                10, 1, 7, 6, -1, 1, 2, 1, 3, 14, -1, 1, 1, -1, -1, 14, -1, 1, 101, -1, -1, 80, -1, -1
            ]
            expect(got).deep.equal(expected)
        });
        it("should flatten the single ABS function to the correct value", () => {
            // Given
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
            let got = flattenN(leaf)
            // Then
            let expected = [
                10, 1, 4, 6, -1, 1, 14, -1, 1, 103, -1, -1, 10, -1, -1
            ]
            expect(got).deep.equal(expected)
        })
        it("should flatten the combined ABS and AND functions to the correct value", () => {
            // Given
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
            let got = flattenN(leaf)
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