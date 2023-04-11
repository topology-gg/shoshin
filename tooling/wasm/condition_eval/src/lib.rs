///! This crate allows to run the Shoshin loop written in Cairo on the cairo-rs VM.
mod types;
use anyhow::Error;
use cairo_execution::execute_cairo_program;
use cairo_execution::utils::{
    convert_to_felt, convert_to_relocatable, convert_to_structure_vector, prepare_args,
};
use cairo_felt::{self, Felt};
use cairo_vm::vm::vm_core::VirtualMachine;
use num_traits::ToPrimitive;
use types::{ConditionEvaluationInputsVec, ConditionEvaluationOutput, Memory};
use wasm_bindgen::prelude::*;

/// Wasm binding to the input the condition evaluation bytecode
/// # Arguments
/// * `inputs` - The flattened inputs to the condition evaluation bytecode
///
/// # Returns
/// The extracted output from the condition evaluation bytecode
#[wasm_bindgen(js_name = evaluateCondition)]
pub fn evaluate_condition(inputs: Vec<i32>) -> Result<JsValue, JsError> {
    let inputs = ConditionEvaluationInputsVec(inputs);
    let inputs = prepare_args(inputs).map_err(|e| JsError::new(&e.to_string()))?;

    let condition_bytecode = include_str!("./bytecode_condition.json");
    let vm = execute_cairo_program(condition_bytecode, "execute_tree_chain", inputs)
        .map_err(|e| JsError::new(&e.to_string()))?;

    let output = get_output(vm).map_err(|e| JsError::new(&e.to_string()))?;
    Result::Ok(serde_wasm_bindgen::to_value(&output)?)
}

/// Extract the condition evaluation from the final VM state
/// # Arguments
/// * `vm` - The final VM state after the shoshin loop execution
///
/// # Returns
/// The condition evaluation output
fn get_output(vm: VirtualMachine) -> Result<ConditionEvaluationOutput, Error> {
    // Handle return values: [output: felt, mem_len: felt, mem: felt*]
    let return_values = vm.get_return_values(3)?;

    let evaluation = convert_to_felt(&return_values[0])?;
    let evaluation = Felt::to_u32(&evaluation)
        .ok_or_else(|| anyhow::anyhow!("error converting evaluation output to u32"))?;

    let mem_len = convert_to_felt(&return_values[1])?;
    let mem_len = Felt::to_u32(&mem_len)
        .ok_or_else(|| anyhow::anyhow!("error converting memory length to u32"))?;

    let mem = convert_to_relocatable(&return_values[2])?;
    let mem = convert_to_structure_vector::<Memory>(mem, mem_len, vm)?;

    Ok(ConditionEvaluationOutput { evaluation, mem })
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::vec;

    fn get_condition_eval_bytecode() -> String {
        std::fs::read_to_string("./src/bytecode_condition.json").unwrap()
    }

    // Evaluates to: Abs(Self_X - Opponent_X) <= 80
    // with Self_X = 30, Opponent_X = 50
    fn get_condition_eval_input_basic() -> Vec<i32> {
        vec![
            8, 10, 1, 7, 6, -1, 1, 2, 1, 3, 14, -1, 1, 1, -1, -1, 14, -1, 1, 101, -1, -1, 80, -1,
            -1, 0, 2, 1, 30, 101, 50,
        ]
    }

    // Evaluates to: (2^6 <= 65) * (30 - 350 % 47) * Abs(!0 - sqrt(150))
    fn get_condition_eval_input_complex() -> Vec<i32> {
        vec![
            18, 3, 1, 12, 3, 1, 6, 10, 1, 4, 8, 1, 2, 2, -1, -1, 6, -1, -1, 65, -1, -1, 2, 1, 2,
            30, -1, -1, 5, 1, 2, 350, -1, -1, 47, -1, -1, 6, -1, 1, 2, 1, 3, 11, -1, 1, 0, -1, -1,
            7, -1, 1, 150, -1, -1, 0, 0,
        ]
    }

    #[test]
    fn test_evaluation_basic() {
        let inputs = get_condition_eval_input_basic();
        let inputs = ConditionEvaluationInputsVec(inputs);
        let inputs = prepare_args(inputs).unwrap();

        let bytecode = get_condition_eval_bytecode();

        let vm = execute_cairo_program(&bytecode, "evaluate_condition", inputs).unwrap();
        let output = get_output(vm).unwrap();
        assert_eq!(
            output.evaluation, 1,
            "incorrect condition evaluation output"
        );
    }

    #[test]
    fn test_evaluation_complex() {
        let inputs = get_condition_eval_input_complex();
        let inputs = ConditionEvaluationInputsVec(inputs);
        let inputs = prepare_args(inputs).unwrap();

        let bytecode = get_condition_eval_bytecode();

        let vm = execute_cairo_program(&bytecode, "evaluate_condition", inputs).unwrap();
        let output = get_output(vm).unwrap();
        assert_eq!(
            output.evaluation, 99,
            "incorrect condition evaluation output"
        );
    }
}
