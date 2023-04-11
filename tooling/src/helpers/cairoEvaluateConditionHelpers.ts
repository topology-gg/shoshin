import { Condition, parseConditionToLeaf } from "../types/Condition";
import Leaf, { flattenLeaf } from "../types/Leaf";

export function getEvaluateConditionInput(condition: Condition, memory: number[], perceptables: Map<number, number>) {
    let flattenedCondition = flattenCondition(condition);
    let flattenedMemory = new Int32Array(memory);
    let flattenedPerceptables = flattenPerceptables(perceptables);

    return new Int32Array([...flattenedCondition, ...flattenedMemory, ...flattenedPerceptables]);
}

function flattenCondition(condition: Condition) {
    let leafCondition: Leaf = parseConditionToLeaf(condition)
    return new Int32Array(flattenLeaf(leafCondition)) 
}

function flattenPerceptables(perceptables: Map<number, number>) {
    let flattenedPerceptables = []
    for (const [key, value] of perceptables.entries()) {
        flattenedPerceptables.push(key, value)
    }
    return new Int32Array(flattenedPerceptables)
}
