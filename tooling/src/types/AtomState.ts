import Grid from './Grid'

export enum AtomStatus {
    FREE = 'free',
    POSSESSED = 'possessed',
    DELIVERED = 'delivered'
}

export default interface AtomState {
    id: string
    typ: string
    status: AtomStatus
    index: Grid
    possessed_by: string
}
