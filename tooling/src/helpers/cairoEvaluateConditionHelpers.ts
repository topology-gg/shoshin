import { PERCEPTIBLE_KEYS } from "../types/Condition";
import Leaf, { flattenLeaf } from "../types/Leaf";

const FLAT_CONDITION_SIZE = 3 // (opcode, left, right)
const FLAT_MEMORY_SIZE = 1 // (mem_value)
const FLAT_PERCEPTIBLE_SIZE = 2 // (key, value)

export function getEvaluateConditionInput(condition: Leaf, memory: number[], perceptibles: number[]): Int32Array {
    let flattenedCondition = flattenLeaf(condition)
    let flattenedConditionWithLength = prependArrayCorrectedLength(flattenedCondition, FLAT_CONDITION_SIZE)

    let flattenedMemoryWithLength = prependArrayCorrectedLength(memory, FLAT_MEMORY_SIZE)

    let perceptiblesWithKey = addPerceptiblesKey(perceptibles)
    let perceptiblesWithKeyAndLength = prependArrayCorrectedLength(perceptiblesWithKey, FLAT_PERCEPTIBLE_SIZE)

    return new Int32Array([
        ...flattenedConditionWithLength, 
        ...flattenedMemoryWithLength, 
        ...perceptiblesWithKeyAndLength
    ])
}

function addPerceptiblesKey(perceptibles: number[]) {
    let keyValuePerceptibles = []
    perceptibles.map((v, i) => {
        keyValuePerceptibles.push(PERCEPTIBLE_KEYS[i], v)
    })
    return keyValuePerceptibles
}

function prependArrayCorrectedLength(array: number[], cairoStructureSize: number) {
    return [array.length / cairoStructureSize , ...array]
}