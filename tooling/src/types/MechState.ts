import Grid from './Grid'

export enum MechStatus {
    CLOSE = 'close',
    OPEN = 'open',
}

export enum MechType {
    SINGLETON = 'SINGLETON',
    DUO = 'DUO', // preparing for the next mech type
}

export default interface MechState {
    id: string
    typ: MechType
    status: MechStatus
    index: Grid
    pc_next: number
}
