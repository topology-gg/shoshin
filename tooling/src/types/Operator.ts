import Grid from './Grid'
import { AtomType } from './AtomState'

export interface OperatorType {
    symbol: string
    name: string
    description: string
    input_atom_types: AtomType[]
    output_atom_types: AtomType[]
}

// TODO: we want dependently-typed interface i.e. Operator.input would have array size determined by Operator.typ
export default interface Operator {
    input: Grid[]
    output: Grid[]
    typ: OperatorType
}

export const OPERATOR_TYPES: {[key:string] : OperatorType} = {
    STIR: {
        description: 'vanilla & vanilla = hazelnut',
        symbol: '&',
        name: 'Stir',
        input_atom_types: [AtomType.VANILLA, AtomType.VANILLA],
        output_atom_types: [AtomType.HAZELNUT]
    },
    SHAKE: {
        description: 'hazelnut % hazelnut = chocolate',
        symbol: '%',
        name: 'Shake',
        input_atom_types: [AtomType.HAZELNUT, AtomType.HAZELNUT],
        output_atom_types: [AtomType.CHOCOLATE]
    },
    STEAM: {
        description: 'hazelnut ~ chocolate ~ chocolate  = truffle, vanilla',
        symbol: '~',
        name: 'Shake',
        input_atom_types: [AtomType.HAZELNUT, AtomType.CHOCOLATE, AtomType.CHOCOLATE],
        output_atom_types: [AtomType.TRUFFLE, AtomType.VANILLA]
    }
}