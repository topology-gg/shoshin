import { flattenN, N } from "./Function"

export default interface Agent {
    states?: string[],
    combos?: number[][],
    mentalStates?: N[],
    initialState?: number,
    generalPurposeFunctions?: N[],
    actions?: number[],
    character?: number,
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
        mentalStatesOffset.push(flattened.length)
        mentalStates.push(...flattened)
    })
    let functionsOffset = []
    let functions = []
    agent.generalPurposeFunctions.forEach((f) => {
        let flattened = flattenN(f)
        functionsOffset.push(flattened.length)
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