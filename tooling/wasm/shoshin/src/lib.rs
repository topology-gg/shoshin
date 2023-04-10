///! This crate allows to run the Shoshin loop written in Cairo on the cairo-rs VM.
mod types;
use crate::types::{FrameScene, ShoshinInputVec};
use anyhow::Error;
use cairo_execution::utils::get_output_arr;
use cairo_execution::{execute_cairo_program, utils::prepare_args};
use cairo_felt::{self, Felt};
use cairo_vm::types::relocatable::Relocatable;
use cairo_vm::vm::vm_core::VirtualMachine;
use num_traits::ToPrimitive;
use wasm_bindgen::prelude::*;

/// Wasm binding to the input of the Shoshin loop
/// # Arguments
/// * `inputs` - The flattened inputs to the shoshin loop
///
/// # Returns
/// The extracted output from the shoshin loop
#[wasm_bindgen(js_name = runCairoProgram)]
pub fn run_cairo_program_wasm(inputs: Vec<i32>) -> Result<JsValue, JsError> {
    let inputs = ShoshinInputVec(inputs);
    let inputs = prepare_args(inputs).map_err(|e| JsError::new(&e.to_string()))?;

    let shoshin_bytecode = include_str!("./compiled_loop.json");
    let vm = execute_cairo_program(shoshin_bytecode, "loop", inputs)
        .map_err(|e| JsError::new(&e.to_string()))?;

    let output = get_output(vm).map_err(|e| JsError::new(&e.to_string()))?;
    Result::Ok(serde_wasm_bindgen::to_value(&output)?)
}

/// Extract the frame scene from the final VM state
/// # Arguments
/// * `vm` - The final VM state after the shoshin loop execution
///
/// # Returns
/// The array of frame scenes casted to a JsValue
fn get_output(vm: VirtualMachine) -> Result<Vec<FrameScene>, Error> {
    // Handle return values: [frames_len: felt, frames: FrameScene*]
    let return_values = vm.get_return_values(2)?;

    let frames_len = return_values[0]
        .get_int_ref()
        .map_err(|e| anyhow::anyhow!(e.to_string()))?;
    let frames_len = Felt::to_u32(frames_len).expect("missing return value for frames_len");

    let frames = return_values[1]
        .get_relocatable()
        .expect("missing return value for frames");

    let output = get_frames(frames, frames_len, vm)?;

    Result::Ok(output)
}

/// Loop over the frames and extract each frame scene
/// # Arguments
/// * `frames` - The pointer to the frames
/// * `frames_len` - The number of frames
/// * `vm` - The final VM state after the shoshin loop execution
///
/// # Returns
/// The array of frame scenes
fn get_frames(
    frames: Relocatable,
    frames_len: u32,
    vm: VirtualMachine,
) -> Result<Vec<FrameScene>, Error> {
    get_output_arr::<FrameScene>(frames, frames_len, vm)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::vec;

    fn get_shoshin_bytecode() -> String {
        std::fs::read_to_string("./src/compiled_loop.json").unwrap()
    }

    // returns a simple input for the shoshin loop (two idle agents)
    fn get_shoshin_input() -> Vec<i32> {
        vec![
            120, 2, 0, 5, 5, 2, 2, 2, 2, 2, 2, 0, 5, 5, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, -1, -1, 0, 2,
            1, 1, 1, 0, -1, -1, 0, 1, 1, 1, 0, -1, -1, 1, 1, 1, 0, -1, -1, 1, 101, 1, 101, 0, 1,
        ]
    }

    // returns a complex input for the shoshin loop (two active agents)
    fn get_shoshin_complex_input() -> Vec<i32> {
        vec![
            120, 2, 0, 7, 7, 7, 7, 2, 2, 2, 2, 2, 3, 0, 6, 12, 12, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5,
            5, 8, 1, 21, 1, 21, 1, 11, 1, 21, 74, 1, 1, 5, 3, 1, 3, 15, -1, 1, 0, -1, -1, 2, -1,
            -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 1,
            -1, -1, 1, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 1, -1, -1, 3, -1, -1, 1, 1,
            5, 3, 1, 3, 15, -1, 1, 0, -1, -1, 2, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0,
            -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 1, -1, -1, 1, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1,
            13, -1, 1, 1, -1, -1, 3, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 0, -1, -1, 2, -1, -1, 3,
            1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0, -1, -1, 0, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1,
            0, -1, -1, 2, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0, -1, -1, 1, 1, 5, 3, 1,
            3, 15, -1, 1, 1, -1, -1, 1, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 1, -1, -1,
            3, -1, -1, 0, 6, 1, 11, 1, 11, 1, 21, 43, 1, 1, 5, 3, 1, 3, 15, -1, 1, 0, -1, -1, 1,
            -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0, -1, -1, 0, -1, -1, 1, 1, 5, 3, 1, 3,
            15, -1, 1, 0, -1, -1, 1, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0, -1, -1, 2,
            -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 0, -1, -1, 1, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1,
            13, -1, 1, 0, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 1, -1, -1, 2, -1, -1, 3, 1, 5, 2, 1,
            2, 1, -1, -1, 13, -1, 1, 1, -1, -1, 0, -1, -1, 0, 2, 14, 8, 22, 1, 1, 5, 12, 1, 3, 14,
            -1, 1, 110, -1, -1, 10, -1, -1, 1, 1, 5, 12, 1, 3, 14, -1, 1, 110, -1, -1, 20, -1, -1,
            12, 1, 3, 14, -1, 1, 110, -1, -1, 30, -1, -1, 10, 1, 7, 6, -1, 1, 2, 1, 3, 14, -1, 1,
            1, -1, -1, 14, -1, 1, 101, -1, -1, 80, -1, -1, 2, 14, 4, 18, 1, 1, 5, 12, 1, 3, 14, -1,
            1, 110, -1, -1, 10, -1, -1, 1, 1, 5, 12, 1, 3, 14, -1, 1, 110, -1, -1, 20, -1, -1, 12,
            1, 3, 14, -1, 1, 110, -1, -1, 30, -1, -1, 10, 1, 3, 14, -1, 1, 11, -1, -1, 4, -1, -1,
            4, 0, 101, 4, 5, 3, 0, 101, 102, 0, 1,
        ]
    }

    #[test]
    fn test_execute_cairo_program_basic_input() {
        let inputs = get_shoshin_input();
        let inputs = ShoshinInputVec(inputs);
        let inputs = prepare_args(inputs).unwrap();

        let bytecode = get_shoshin_bytecode();

        execute_cairo_program(&bytecode, "loop", inputs).unwrap();
    }

    #[test]
    fn test_get_output_frames_basic_inputs() {
        let inputs = get_shoshin_input();
        let inputs = ShoshinInputVec(inputs);
        let inputs = prepare_args(inputs).unwrap();

        let bytecode = get_shoshin_bytecode();

        let vm = execute_cairo_program(&bytecode, "loop", inputs).unwrap();
        get_output(vm).unwrap();
    }

    #[test]
    fn test_execute_cairo_program_complex_input() {
        let inputs = get_shoshin_complex_input();
        let inputs = ShoshinInputVec(inputs);
        let inputs = prepare_args(inputs).unwrap();

        let bytecode = get_shoshin_bytecode();

        execute_cairo_program(&bytecode, "loop", inputs).unwrap();
    }

    #[test]
    fn test_get_output_frames_complex_input() {
        let inputs = get_shoshin_complex_input();
        let inputs = ShoshinInputVec(inputs);
        let inputs = prepare_args(inputs).unwrap();

        let bytecode = get_shoshin_bytecode();

        let vm = execute_cairo_program(&bytecode, "loop", inputs).unwrap();
        get_output(vm).unwrap();
    }
}
