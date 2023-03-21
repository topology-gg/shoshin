import Agent from "./Agent";
import Leaf, { unflattenLeaf, SimpleLeaf } from "./Leaf";

export interface Metadata {
    combos_offset_0: number[],
    combos_0: number[],
    combos_offset_1: number[],
    combos_1: number[],
    state_machine_offset_0: number[],
    state_machine_0: SimpleLeaf[],
    initial_state_0: number,
    state_machine_offset_1: number[],
    state_machine_1: SimpleLeaf[],
    initial_state_1: number,
    conditions_offset_0: number[],
    conditions_0: SimpleLeaf[],
    conditions_offset_1: number[],
    conditions_1: SimpleLeaf[],
    actions_0: number[],
    actions_1: number[],
    character_0: number,
    character_1: number,
}

// Split the metadata into the two corresponding agents
export function splitMetadata(a: Metadata): [Agent, Agent] {
    let combos0: number[][] = []
    // for offset = [0, 5, 10, 15], zip [(0, 5), (5, 10), (10, 15)]
    // extract the combos based on the zipped arrays
    let cOffset0a = a.combos_offset_0.slice(0, -1)
    let cOffset0b = a.combos_offset_0.slice(1)
    let cOffset0 = cOffset0a.map((c, i) => [c, cOffset0b[i]])
    cOffset0.forEach((c) => {
        combos0.push(a.combos_0.slice(c[0], c[1]))
    })
    let combos1: number[][] = []
    let cOffset1a = a.combos_offset_1.slice(0, -1)
    let cOffset1b = a.combos_offset_1.slice(1)
    let cOffset1 = cOffset1a.map((c, i) => [c, cOffset1b[i]])
    cOffset1.forEach((c) => {
        combos1.push(a.combos_1.slice(c[0], c[1]))
    })

    let start = 0
    let sm0: Leaf[] = []
    // offset are [MS_0_TREE_AMOUNT, LEN_MS_0_TREE_0, LEN_MS_0_TREE_1, ..., MS_1_TREE_AMOUNT, LEN_MS_1_TREE_0, ...]
    // filter out MS_i_TREE_AMOUNT for now
    let smOffset0 = a.state_machine_offset_0.filter((_, i) => {
        return i%2 != 0
    })
    smOffset0.forEach((o) => {
        let mentalState = a.state_machine_0.slice(start, start + o)
        sm0 = sm0.concat(unflattenLeaf(mentalState))
        start += o
    })
    let states0 = sm0.map((_, i) => {
        return "MS " + i
    })
    start = 0
    let sm1: Leaf[] = []
    let smOffset1 = a.state_machine_offset_1.filter((_, i) => {
        return i%2 != 0
    })
    smOffset1.forEach((o) => {
        let mentalState = a.state_machine_1.slice(start, start + o)
        sm1 = sm1.concat(unflattenLeaf(mentalState))
        start += o
    })
    let states1 = sm1.map((_, i) => {
        return "MS " + i
    })

    // extract the general purpose conditions (conditions)
    // offset in the form [LEN_FUNC_1, LEN_FUNC_2, ...]
    start = 0
    let conditions0: Leaf[] = []
    let conditionsOffset0 = a.conditions_offset_0
    conditionsOffset0.forEach((o) => {
        let func = a.conditions_0.slice(start, start + o)
        conditions0 = conditions0.concat(unflattenLeaf(func))
        start += o
    })
    start = 0
    let conditions1: Leaf[] = []
    let conditionsOffset1 = a.conditions_offset_1
    conditionsOffset1.forEach((o) => {
        let func = a.conditions_1.slice(start, start + o)
        conditions1 = conditions1.concat(unflattenLeaf(func))
        start += o
    })

    return [
        {
            mentalStatesNames: states0,
            combos: combos0,
            mentalStates: sm0,
            initialState: a.initial_state_0,
            conditions: conditions0,
            actions: a.actions_0,
            character: a.character_0
        },
        {
            mentalStatesNames: states1,
            combos: combos1,
            mentalStates: sm1,
            initialState: a.initial_state_1,
            conditions: conditions1,
            actions: a.actions_1,
            character: a.character_1
        }
    ]
}

export interface SingleMetadata {
    combos_offset: number[],
    combos: number[],
    state_machine_offset: number[],
    state_machine: SimpleLeaf[],
    state_machine_names: string[],
    initial_state: number,
    conditions_offset: number[],
    conditions: SimpleLeaf[],
    conditions_names: string[],
    actions: number[],
    character: number,
    sender : string
}

export function splitSingleMetadata(meta: SingleMetadata): Agent {
    let combos: number[][] = []
    // for offset = [0, 5, 10, 15], zip [(0, 5), (5, 10), (10, 15)]
    // extract the combos based on the zipped arrays
    let cOffseta = meta.combos_offset.slice(0, -1)
    let cOffsetb = meta.combos_offset.slice(1)
    let cOffset = cOffseta.map((c, i) => [c, cOffsetb[i]])
    cOffset.forEach((c) => {
        combos.push(meta.combos.slice(c[0], c[1]))
    })

    let start = 0
    let sm: Leaf[] = []
    // offset are [MS_0_TREE_AMOUNT, LEN_MS_0_TREE_0, LEN_MS_0_TREE_1, ..., MS_1_TREE_AMOUNT, LEN_MS_1_TREE_0, ...]
    // filter out MS_i_TREE_AMOUNT for now
    let smOffset = meta.state_machine_offset.filter((_, i) => {
        return i%2 != 0
    })
    smOffset.forEach((o) => {
        let mentalState = meta.state_machine.slice(start, start + o)
        sm = sm.concat(unflattenLeaf(mentalState))
        start += o
    })

    // extract the conditions
    // offset in the form [LEN_FUNC_1, LEN_FUNC_2, ...]
    start = 0
    let conditions: Leaf[] = []
    let conditionOffset = meta.conditions_offset
    conditionOffset.forEach((o) => {
        let func = meta.conditions.slice(start, start + o)
        conditions = conditions.concat(unflattenLeaf(func))
        start += o
    })

    return {
            mentalStatesNames: meta.state_machine_names.map((s) => s.replaceAll('\x00', '')), // delete all 0x00
            combos: combos,
            mentalStates: sm,
            initialState: meta.initial_state,
            conditions: conditions,
            actions: meta.actions,
            character: meta.character
        }
}