
export enum BgStatus {
    EMPTY = 'empty',
    ATOM_VANILLA_FREE = 'vanilla_free',
    ATOM_VANILLA_POSSESSED = 'vanilla_possessed',
    ATOM_HAZELNUT_FREE = 'hazelnut_free',
    ATOM_HAZELNUT_POSSESSED = 'hazelnut_possessed',
    ATOM_CHOCOLATE_FREE = 'chocolate_free',
    ATOM_CHOCOLATE_POSSESSED = 'chocolate_possessed',
    ATOM_TRUFFLE_FREE = 'truffle_free',
    ATOM_TRUFFLE_POSSESSED = 'truffle_possessed',
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
    OPERAND_STIR = '&',
    OPERAND_SHAKE = '%',
    OUTPUT = '=',
}

export default interface UnitState {
    unit_id: string | null,
    bg_status: BgStatus,
    border_status: BorderStatus,
    unit_text: UnitText
}
