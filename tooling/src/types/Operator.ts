import Grid from './Grid'

export enum OperatorType {
    ADDER = 'ADDER',
}

export default interface Operator {
    input: Grid[]
    output: Grid[]
    typ: OperatorType
}
