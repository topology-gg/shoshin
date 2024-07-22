import { readFileSync } from 'fs';
import { expect } from 'chai';
import * as mocha from 'mocha';
import { buildEulerTour } from '../euler';
import {
    Edge,
    Node,
    buildNode,
    orderEdges,
    edgesToAdjacencyList,
} from '../types';

function getInputTestData(): Edge[] {
    return JSON.parse(readFileSync('./src/test/input_test.json', 'utf8')).edges;
}

describe('Edge', () => {
    it('should order the edges', () => {
        // Given
        let expected = getInputTestData();
        let actual = getInputTestData().sort((a, b) =>
            Math.round(Math.random() * 2 - 1)
        );

        // When
        orderEdges(actual);

        // Then
        expect(actual).to.deep.equal(expected);
    });

    it('should construct the adjacency list', () => {
        // Given
        let edges = getInputTestData();

        // When
        let actual = edgesToAdjacencyList(edges);
        let expected = objectToMap({
            1: [2],
            2: [3, 6],
            3: [4, 5],
            6: [7],
            7: [8, 9],
            9: [10],
        });

        // Then
        expect(actual).to.deep.equal(expected);
    });
});

describe('Node', () => {
    it('should constuct the node from edges', () => {
        // Given
        let edges = getInputTestData();
        let adjacencyList = edgesToAdjacencyList(edges);

        // When
        let actual = buildNode(adjacencyList);
        let expected: Node = {
            value: 1,
            left: {
                value: 2,
                left: {
                    value: 3,
                    left: { value: 4, left: null, right: null },
                    right: { value: 5, left: null, right: null },
                },
                right: {
                    value: 6,
                    left: {
                        value: 7,
                        left: { value: 8, left: null, right: null },
                        right: {
                            value: 9,
                            left: {
                                value: 10,
                                left: null,
                                right: null,
                            },
                            right: null,
                        },
                    },
                    right: null,
                },
            },
            right: null,
        };

        // Then
        expect(actual).to.deep.equal(expected);
    });

    it('should construct the euler tour', () => {
        // Given
        let edges = getInputTestData();
        let adjacencyList = edgesToAdjacencyList(edges);
        let node = buildNode(adjacencyList)!;

        // When
        let actual = [];
        buildEulerTour(node, actual);
        let expected = [
            1, 2, 3, 4, 3, 5, 3, 2, 6, 7, 8, 7, 9, 10, 9, 7, 6, 2, 1,
        ];

        // Then
        expect(actual).to.deep.equal(expected);
    });
});

function objectToMap(obj: Object): Map<number, number[]> {
    return new Map<number, number[]>(
        Object.entries(obj).map(([key, value]) => [parseInt(key), value])
    );
}
