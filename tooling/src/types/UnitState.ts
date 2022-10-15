
export enum BgStatus {
    EMPTY = 'empty',
    ATOM_VANILLA_FREE = 'vanilla_free',
    ATOM_VANILLA_POSSESSED = 'vanilla_possessed',
    ATOM_HAZELNUT_FREE = 'hazelnut_free',
    ATOM_HAZELNUT_POSSESSED = 'hazelnut_possessed',
}

export enum BorderStatus {
    EMPTY = 'empty',
    SINGLETON_OPEN = 'singleton_open',
    SINGLETON_CLOSE = 'singleton_close',
}

export enum UnitText {
    EMPTY = '',
    GRID = '·',
    FAUCET = 'F',
    SINK = 'S',
    OPERAND_ADD = '+',
    OUTPUT = '=',
}

export default interface UnitState {
    bg_status: BgStatus,
    border_status: BorderStatus,
    unit_text: UnitText
}
