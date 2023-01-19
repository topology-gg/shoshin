import { N } from "./Function"

export default interface Agent {
    states?: string[],
    combos?: number[][],
    initialState?: number,
    mentalStates?: N[],
    generalPurposeFunctions?: N[]
}

export interface Operations {
    data?: (string|[])[]
}