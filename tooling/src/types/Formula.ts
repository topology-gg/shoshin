import Grid from './Grid'
import { AtomType } from './AtomState'

export enum OperatorType {
    STIR = 'STIR',
    SHAKE = 'SHAKE',
    STEAM = 'STEAM'
}

export enum OperatorSymbol {
    STIR = '&',
    SHAKE = '%',
    STEAM = '#'
}

// export interface OperatorElementType {
//     grid: Grid
//     typ: AtomType
// }

export interface Operator {
    reactants: Grid[]
    products: Grid[]
    typ: OperatorType
}
