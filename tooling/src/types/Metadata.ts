import Agent from "./Agent";
import Leaf from "./Leaf";

export interface Metadata {
    combos_offset_0: number[],
    combos_0: number[],
    combos_offset_1: number[],
    combos_1: number[],
    state_machine_offset_0: number[],
    state_machine_0: Leaf[],
    initial_state_0: number,
    state_machine_offset_1: number[],
    state_machine_1: Leaf[],
    functions_offset_0: number[],
    functions_0: Leaf[],
    functions_offset_1: number[],
    functions_1: Leaf[],
    actions_0: number[],
    actions_1: number[],
    character_0: number,
    character_1: number,
}

export function splitAgents(a: Metadata): [Agent, Agent] {
    let combos_0: number[][] = []
    let c_offset_0_a = a.combos_offset_0.slice(0, -1)
    let c_offset_0_b = a.combos_offset_0.slice(1)
    let c_offset_0 = c_offset_0_a.map((c, i) => [c, c_offset_0_b[i]])
    c_offset_0.forEach((c) => {
        combos_0.push(a.combos_0.slice(c[0], c[1]))
    })
    console.log("combos_0", combos_0)
    return [{}, {}]
}