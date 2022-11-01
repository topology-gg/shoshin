import { compileCalldata } from "starknet/dist/utils/stark";
import { toBN } from 'starknet/dist/utils/number'
import Grid from "../types/Grid";
import Operator, { OperatorType, OPERATOR_TYPES } from '../types/Operator';

export function programsToInstructionSets (programs) {

    let instructionSets:string[][] = []

    programs.forEach((program: string, mech_i:number) => {
        const instructions = program.split(',') as string[]
        instructionSets.push (instructions)
    })

    return instructionSets
}

export default function packSolution (instructionSets: string[][], mechInitPositions: Grid[], operatorStates: Operator[]) {

    if (!instructionSets || !mechInitPositions || !operatorStates){
        console.log('oops?', instructionSets, mechInitPositions, operatorStates)
        return []
    }

    // Prepare input arg on solution's mech programs
    let program_length_array = []
    let program_serialized_array = []
    for (const instructionSet of instructionSets) {
        program_length_array.push (pack(instructionSet.length))

        const encoded_program = encodeInstructionSet (instructionSet)
        program_serialized_array = program_serialized_array.concat (encoded_program)
    }

    // Prepare input arg on solution's mech states
    let mech_array = []
    mechInitPositions.forEach((grid: Grid, index: number) => {
        mech_array.push({
            id: pack(index),
            type: pack(0),
            status: pack(0), // open
            index: packGrid(grid),
        })
    });

    // Prepare input arg on solution's operators
    let operator_type_array = []
    let operator_input_serialized_array = []
    let operator_output_serialized_array = []
    for (const operator of operatorStates) {

        const packed_input = operator.input.map (value => packGrid(value))
        const packed_output = operator.output.map (value => packGrid(value))

        operator_input_serialized_array = operator_input_serialized_array.concat (packed_input)
        operator_output_serialized_array = operator_input_serialized_array.concat (packed_output)

        if (operator.typ == OPERATOR_TYPES.STIR){
            operator_type_array.push (pack(0))
        }
        else if (operator.typ == OPERATOR_TYPES.SHAKE){
            operator_type_array.push (pack(1))
        }
        else if (operator.typ == OPERATOR_TYPES.STEAM){
            operator_type_array.push (pack(2))
        }
        else if (operator.typ == OPERATOR_TYPES.SMASH){
            operator_type_array.push (pack(3))
        }

    }

    // Note: simulator() function signature
    // mechs_len: felt,
    // mechs: MechState*,
    // instructions_sets_len: felt,
    // instructions_sets: felt*,
    // instructions_len: felt,
    // instructions: felt*,
    // operators_inputs_len: felt,
    // operators_inputs: Grid*,
    // operators_outputs_len: felt,
    // operators_outputs: Grid*,
    // operators_type_len: felt,
    // operators_type: felt*,

    return compileCalldata({
        mechs: mech_array,
        instructions_sets: program_length_array,
        instructions: program_serialized_array,
        operators_inputs: operator_input_serialized_array,
        operators_outputs: operator_output_serialized_array,
        operators_type: operator_type_array
    })
}

// pack for starknet.js requirement for compileCalldata()
function pack (x: number) {
    return toBN(x).toString()
}
function packGrid (grid: Grid){
    return {x: pack(grid.x), y: pack(grid.y)}
}

function encodeInstructionSet (instructionSet) {

    let encodedInstructionSet = []

    for (const instruction of instructionSet) {
        if ( !(instruction in instruction_encode) ){
            encodedInstructionSet.push (pack(8)) // no op
        }
        else {
            encodedInstructionSet.push (pack(instruction_encode[instruction]))
        }
    }

    return encodedInstructionSet
}

//
// Encoding / structs from Cairo implementation
//
const instruction_encode = {
    W : 0,
    A : 1,
    S : 2,
    D : 3,
    Z : 4,
    X : 5,
    G : 6,
    H : 7,
    // _ : 8
}

// const STIR = 0;
// const SHAKE = 1;
// const STEAM = 2;
// const SMASH = 3;

// struct MechState {
//     id: felt,
//     type: felt,
//     status: felt,
//     index: Grid,
// }

// (mech states)
// const OPEN = 0;
// const CLOSE = 1;
// const SINGLETON = 0;