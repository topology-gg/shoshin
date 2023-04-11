import { parseConditionToLeaf, Condition } from "./Condition"
import Leaf, { flattenLeaf } from "./Leaf"
import { MentalState, parseTree } from "./MentalState"
import { Tree } from "./Tree"
import { FRAME_COUNT, PRIME } from "../constants/constants"
import { encodeStringToFelt } from "./utils"

export default interface Agent {
    mentalStatesNames?: string[],
    combos?: number[][],
    mentalStates?: Leaf[],
    initialState?: number,
    conditions?: Leaf[],
    conditionNames?: string[],
    actions?: number[],
    character?: number,
}

// Build the agent from the user's mental states (consisting of the Tree construction for each mental state and the
// action linked to this state), combos, conditions, initial mental state and character
export function buildAgent(mentalStates: MentalState[], combos: number[][], trees: Tree[], conditions: Condition[], initialMentalState, character) {
    let agent: Agent = {}
    agent.combos = combos
    agent.mentalStatesNames = mentalStates.map((ms) => ms.state)
    agent.initialState = initialMentalState

    let agentMentalStates = []
    // used to only extract the conditions used in the mental states
    let indexes: Map<number, boolean> = new Map()
    trees.forEach((t: Tree) => {
        let [parsedMentalState, usedConditions] = parseTree(t, mentalStates)
        usedConditions.forEach((k, _) => {
            indexes.set(k, true)
        })
        agentMentalStates.push(parsedMentalState)
    })
    agent.mentalStates = agentMentalStates

    let agentConditions = []
    let agentCondtionNames = []
    // makes use of indexes to only parse the necessary conditions
    Array.from(indexes.keys()).sort((a, b) => a - b).map((i) => conditions[i]).forEach((f) => {
        // Temporary code to deal with backend bug, can be removed in subsequent pr, April 6, 2023
        agentCondtionNames.push(f.displayName.replaceAll("\u0000",""))
        agentConditions.push(parseConditionToLeaf(f))
    })
    agent.conditionNames = agentCondtionNames
    agent.conditions = agentConditions

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
// conditionsOffsets should be in the form
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

    // flatten condition
    let conditionsOffset = []
    let conditions = []
    agent.conditions.forEach((f) => {
        let flattened = flattenLeaf(f)
        conditionsOffset.push(flattened.length / 3)
        conditions.push(...flattened)
    })

    return [
        combosOffset,
        combos,
        mentalStatesOffset,
        mentalStates,
        conditionsOffset,
        conditions,
    ]
}

// Convert the two agents into an array of calldata
export function agentsToArray(p1: Agent, p2: Agent): number[] {
    // flatten the first agent
    let [
        p1CombosOffset,
        p1Combos,
        p1MentalStatesOffset,
        p1MentalStates,
        p1ConditionsOffset,
        p1Conditions,
    ] = flattenAgent(p1);
    // flatten the second agent
    let [
        p2CombosOffset,
        p2Combos,
        p2MentalStatesOffset,
        p2MentalStates,
        p2ConditionsOffset,
        p2Conditions,
    ] = flattenAgent(p2);

    return [
        FRAME_COUNT,
        p1CombosOffset.length,
        ...p1CombosOffset,
        p1Combos.length,
        ...p1Combos,
        p2CombosOffset.length,
        ...p2CombosOffset,
        p2Combos.length,
        ...p2Combos,
        p1MentalStatesOffset.length,
        ...p1MentalStatesOffset,
        p1MentalStates.length / 3,
        ...p1MentalStates,
        p1.initialState,
        p2MentalStatesOffset.length,
        ...p2MentalStatesOffset,
        p2MentalStates.length / 3,
        ...p2MentalStates,
        p2.initialState,
        p1ConditionsOffset.length,
        ...p1ConditionsOffset,
        p1Conditions.length / 3,
        ...p1Conditions,
        p2ConditionsOffset.length,
        ...p2ConditionsOffset,
        p2Conditions.length / 3,
        ...p2Conditions,
        p1.actions.length,
        ...p1.actions,
        p2.actions.length,
        ...p2.actions,
        p1.character,
        p2.character,
    ];
}

export function agentToArray(agent: Agent): number[] {
    // flatten the agent
    let [
        combosOffset,
        combos,
        mentalStatesOffset,
        mentalStates,
        conditionsOffset,
        conditions,
    ] = flattenAgent(agent);

    return [
        combosOffset.length,
        ...combosOffset,
        combos.length,
        ...combos,
        mentalStatesOffset.length,
        ...mentalStatesOffset,
        mentalStates.length / 3,
        ...mentalStates,
        agent.mentalStatesNames.length,
        ...agent.mentalStatesNames.map(encodeStringToFelt),
        agent.initialState,
        conditionsOffset.length,
        ...conditionsOffset,
        conditions.length / 3,
        ...conditions,
        agent.conditionNames.length,
        ...agent.conditionNames.map(encodeStringToFelt),
        agent.actions.length,
        ...agent.actions,
        agent.character,
    ]
}

export function agentsToCalldata(agent: Agent, opponent: Agent): string[] {
    let args = agentsToArray(agent, opponent)
    return args.map((a) => {
        return '' + (a < 0? (PRIME + BigInt(a)).toString(): a)
    })
}

export function agentToCalldata(agent: Agent): string[] {
    let args = agentToArray(agent)
    return args.map((a) => {
        return '' + (a < 0? (PRIME + BigInt(a)).toString(): a)
    })
}

export function equals(agent_1: Agent, agent_2: Agent) {
    return JSON.stringify(agent_1) === JSON.stringify(agent_2)
}