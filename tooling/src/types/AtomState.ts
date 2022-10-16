import Grid from './Grid'

export enum AtomStatus {
    FREE = 'free',
    POSSESSED = 'possessed',
    DELIVERED = 'delivered',
    CONSUMED = 'consumed',
}

export enum AtomType {
    VANILLA = 'VANILLA',
    HAZELNUT = 'HAZELNUT',
}

export default interface AtomState {
    id: string
    typ: AtomType
    status: AtomStatus
    index: Grid
    possessed_by: string
}
