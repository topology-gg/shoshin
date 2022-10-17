import AtomState, {AtomType} from "../types/AtomState"

// lower case f because this is not a react component
export const FORMULA_TWO_TO_ONE = [
    {
        description: 'vanilla + vanilla = hazelnut',
        type_a: AtomType.VANILLA,
        type_b: AtomType.VANILLA,
        type_z: AtomType.HAZELNUT
    },
    {
        description: 'hazelnut + hazelnut = chocolate',
        type_a: AtomType.HAZELNUT,
        type_b: AtomType.HAZELNUT,
        type_z: AtomType.CHOCOLATE
    }
]