import AtomState, {AtomType} from "../src/types/AtomState"

export const FormulaTwoToOne = [
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