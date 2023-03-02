import { parseFunction } from "./Function"
import Leaf, { flattenLeaf } from "./Leaf" 
import { MentalState, parseTree } from "./MentalState"
import { Tree } from "./Tree"
import { Function } from "./Function"

export default interface Agent {
    states?: string[],
    combos?: number[][],
    mentalStates?: Leaf[],
    initialState?: number,
    generalPurposeFunctions?: Leaf[],
    actions?: number[],
    character?: number,
}

// Build the agent from the user's mental states (consisting of the Tree construction for each mental state and the
// action linked to this state), combos, functions, initial mental state and character
export function buildAgent(mentalStates: MentalState[], combos: number[][], trees: Tree[], functions: Function[], initialMentalState, character) {
    let agent: Agent = {}
    agent.combos = combos
    agent.states = mentalStates.map((ms) => ms.state)
    agent.initialState = initialMentalState

    let agentMentalStates = []
    // used to only extract the functions used in the mental states
    let indexes: Map<number, boolean> = new Map()
    mentalStates.forEach((_, i) => {
        let [parsedMentalState, usedFunctions] = parseTree(trees[i], mentalStates)
        usedFunctions.forEach((_, k) => {
            indexes.set(k, true)
        })
        agentMentalStates.push(parsedMentalState)
    })
    agent.mentalStates = agentMentalStates

    let agentFunctions = []
    // makes use of indexes to only parse the necessary functions
    Array.from(indexes.keys()).sort((a, b) => a - b).map((i) => functions[i]).forEach((f) => {
        agentFunctions.push(parseFunction(f))
    })
    agent.generalPurposeFunctions = agentFunctions

    agent.actions = mentalStates.map((ms) => ms.action)
    agent.character = character
    return agent
}

export interface Operations {
    data?: (string|[])[]
}

// Flatten the agent
// combosOffset should be in the form
// [0 LEN_COMBO_0, LEN_COMBO_1, LEN_COMBO_2, ...]
// mentalStatesOffset should be in the form (in the current implementation, only one tree is usedd so COUNT_TREES_STATE_i will always be 1)
// [COUNT_TREES_STATE_0, LEN_TREE_0_STATE_0, LEN_TREE_1_STATE_0, ..., COUNT_TREES_STATE_1, LEN_TREE_0_STATE_1, LEN_TREE_1_STATE_1, ...]
// functionsOffsets should be in the form
// [LEN_TREE_0, LEN_TREE_1, LEN_TREE_2, ...]
export function flattenAgent(agent: Agent) {
    // flatten combos
    let combosOffset = [0]
    let combos = []
    agent.combos.forEach((c) => {
        combosOffset.push(combos.push(...c))
    })

    // flatten mental states
    let mentalStatesOffset = []
    let mentalStates = []
    agent.mentalStates.forEach((ms) => {
        mentalStatesOffset.push(1)
        let flattened = flattenLeaf(ms)
        mentalStatesOffset.push(flattened.length / 3)
        mentalStates.push(...flattened)
    })

    // flatten function
    let functionsOffset = []
    let functions = []
    agent.generalPurposeFunctions.forEach((f) => {
        let flattened = flattenLeaf(f)
        functionsOffset.push(flattened.length / 3)
        functions.push(...flattened)
    })

    return [
        new Int32Array(combosOffset), 
        new Int32Array(combos), 
        new Int32Array(mentalStatesOffset), 
        new Int32Array(mentalStates), 
        new Int32Array(functionsOffset), 
        new Int32Array(functions),
    ]
}

export function equals(agent_1: Agent, agent_2: Agent) {
    return JSON.stringify(agent_1) === JSON.stringify(agent_2)
}