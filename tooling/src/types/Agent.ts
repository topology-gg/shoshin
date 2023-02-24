import { parseFunction } from "./Function"
import Leaf, { flattenN } from "./Leaf" 
import { MentalState, parseMentalState } from "./MentalState"
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

export function buildAgent(mentalStates: MentalState[], combos: number[][], trees: Tree[], functions: Function[], initialMentalState, character) {
    let agent: Agent = {}
    agent.combos = combos
    agent.states = mentalStates.map((ms) => ms.state)
    agent.initialState = initialMentalState

    let agentMentalStates = []
    let indexes: Map<number, boolean> = new Map()
    mentalStates.forEach((_, i) => {
        let [parsedMentalState, usedFunctions] = parseMentalState(trees[i], mentalStates)
        usedFunctions.forEach((_, k) => {
            indexes.set(k, true)
        })
        agentMentalStates.push(parsedMentalState)
    })
    agent.mentalStates = agentMentalStates

    let agentFunctions = []
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

export function flattenAgent(agent: Agent) {
    let combosOffset = [0]
    let combos = []
    agent.combos.forEach((c) => {
        combosOffset.push(combos.push(...c))
    })
    let mentalStatesOffset = []
    let mentalStates = []
    agent.mentalStates.forEach((ms) => {
        mentalStatesOffset.push(1)
        let flattened = flattenN(ms)
        mentalStatesOffset.push(flattened.length / 3)
        mentalStates.push(...flattened)
    })
    let functionsOffset = []
    let functions = []
    agent.generalPurposeFunctions.forEach((f) => {
        let flattened = flattenN(f)
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