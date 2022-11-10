import Grid from "./Grid";
import { AtomType } from "./AtomState";

export interface OperatorType {
    symbol: string;
    name: string;
    description: string;
    color: string;
    input_atom_types: AtomType[];
    output_atom_types: AtomType[];
}

export default interface Operator {
    input: Grid[];
    output: Grid[];
    typ: OperatorType;
}

// ref to color palette: https://colorhunt.co/
export const OPERATOR_TYPES: { [key: string]: OperatorType } = {
    STIR: {
        description: "vanilla & vanilla = hazelnut",
        symbol: "&",
        name: "Stir ",
        color: "#A7D2CB",
        input_atom_types: [AtomType.VANILLA, AtomType.VANILLA],
        output_atom_types: [AtomType.HAZELNUT],
    },
    SHAKE: {
        description: "hazelnut % hazelnut = chocolate",
        symbol: "%",
        name: "Shake",
        color: "#F2D388",
        input_atom_types: [AtomType.HAZELNUT, AtomType.HAZELNUT],
        output_atom_types: [AtomType.CHOCOLATE],
    },
    STEAM: {
        description: "hazelnut ~ chocolate ~ chocolate  = truffle, vanilla",
        symbol: "^",
        name: "Steam",
        color: "#C98474",
        input_atom_types: [
            AtomType.HAZELNUT,
            AtomType.CHOCOLATE,
            AtomType.CHOCOLATE,
        ],
        output_atom_types: [AtomType.TRUFFLE, AtomType.VANILLA],
    },
    SMASH: {
        description: "truffle = vanilla, vanilla, vanilla, vanilla, saffron",
        symbol: "#",
        name: "Smash",
        color: "#874C62",
        input_atom_types: [AtomType.TRUFFLE],
        output_atom_types: [
            AtomType.VANILLA,
            AtomType.VANILLA,
            AtomType.VANILLA,
            AtomType.VANILLA,
            AtomType.SAFFRON,
        ],
    },
};
