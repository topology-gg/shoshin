import "mocha";
import { expect } from "chai";
import Leaf, { SimpleLeaf, flattenLeaf, unflattenLeaf } from "../types/Leaf";


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