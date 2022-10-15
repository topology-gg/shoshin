import Grid from './Grid'

export enum BinaryOperatorType {
    ADDER = 'adder',
}

export default interface BinaryOperator {
    a: Grid
    b: Grid
    z: Grid
    typ: BinaryOperatorType
}
