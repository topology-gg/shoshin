
export enum BgStatus {
    EMPTY = 'empty',
    ATOM_VANILLA_FREE = 'vanilla_free',
    ATOM_VANILLA_POSSESSED = 'vanilla_possessed',
}

export enum BorderStatus {
    EMPTY = 'empty',
    SINGLETON_OPEN = 'singleton_open',
    SINGLETON_CLOSE = 'singleton_close',
}

export default interface UnitState {
    bg_status: BgStatus,
    border_status: BorderStatus,
}
