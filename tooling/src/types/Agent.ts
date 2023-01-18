export default interface Agent {
    states?: string[],
    combos?: number[][],
    initial_state?: number,
    mental_states?: Map<string, Operations>,
    general_purpose_functions?: Operations[]
}

export interface Operations {
    data?: (string|[])[]
}