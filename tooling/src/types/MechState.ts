import Grid from './Grid'

export enum MechStatus {
    CLOSE = 'close',
    OPEN = 'open',
}

export enum MechType {
    SINGLETON = 'SINGLETON',
}

export default interface MechState {
    id: string
    typ: MechType
    status: MechStatus
    index: Grid
}
