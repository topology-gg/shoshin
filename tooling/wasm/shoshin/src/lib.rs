///! This crate allows to run the Shoshin loop written in Cairo on the cairo-rs VM.
mod types;
mod utils;
use anyhow::Error;
use cairo_execution::execute_cairo_program;
use cairo_felt::{self, Felt};
use cairo_vm::types::relocatable::MaybeRelocatable;
use cairo_vm::vm::vm_core::VirtualMachine;
use cairo_vm::{types::relocatable::Relocatable, vm::runners::cairo_runner::CairoArg};
use num_bigint::BigInt;
use num_traits::ToPrimitive;
use types::{FrameScene, ShoshinInput, Sizeable};
use wasm_bindgen::prelude::*;

/// Wasm binding to the input of the Shoshin loop
/// # Arguments
/// * `inputs` - The flattened inputs to the shoshin loop
///
/// # Returns
/// The extracted output from the shoshin loop
#[wasm_bindgen(js_name = runCairoProgram)]
pub fn run_cairo_program_wasm(inputs: Vec<i32>) -> Result<JsValue, JsError> {
    let inputs = prepare_args(inputs).map_err(|e| JsError::new(&e.to_string()))?;

    let shoshin_bytecode = include_str!("./compiled_loop.json");
    let vm = execute_cairo_program(shoshin_bytecode, "loop", inputs)
        .map_err(|e| JsError::new(&e.to_string()))?;

    let output = get_output(vm).map_err(|e| JsError::new(&e.to_string()))?;
    Result::Ok(serde_wasm_bindgen::to_value(&output)?)
}

fn prepare_args(inputs: Vec<i32>) -> Result<Vec<CairoArg>, Error> {
    let range_check_ptr = MaybeRelocatable::from((2, 0));
    let frames_count = mayberelocatable!(120);
    let inputs = ShoshinInput::from(inputs);

    let mut args: Vec<CairoArg> = vec![
        CairoArg::from(range_check_ptr),
        CairoArg::from(frames_count),
    ];
    args.extend(Into::<Vec<CairoArg>>::into(inputs));
    Ok(args)
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

fn get_frames(
    frames: Relocatable,
    frames_len: u32,
    vm: VirtualMachine,
) -> Result<Vec<FrameScene>, Error> {
    let frame_struct_size = FrameScene::size(&FrameScene::default()) as u32;
    let mut output = vec![];

    for i in 0..frames_len {
        let mut frame = Vec::new();
        // Reverse the memory iteration, in order to be able to .pop() starting from the first value in
        // the memory segment
        for j in (0..frame_struct_size).rev() {
            let word_address = Relocatable {
                segment_index: frames.segment_index,
                offset: (i * frame_struct_size + j) as usize,
            };
            frame.push(vm.get_integer(word_address).unwrap().to_bigint());
        }
        output.push(FrameScene::from(frame));
    }
    Ok(output)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::vec;

    fn get_shoshin_bytecode() -> String {
        std::fs::read_to_string("./src/compiled_loop.json").unwrap()
    }

    fn get_shoshin_input() -> Vec<i32> {
        vec![
            2, 0, 5, 5, 2, 2, 2, 2, 2, 2, 0, 5, 5, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, -1, -1, 0, 2, 1,
            1, 1, 0, -1, -1, 0, 1, 1, 1, 0, -1, -1, 1, 1, 1, 0, -1, -1, 1, 101, 1, 101, 0, 1,
        ]
    }

    fn get_shoshin_complex_input() -> Vec<i32> {
        vec![
            2, 0, 7, 7, 7, 7, 2, 2, 2, 2, 2, 3, 0, 6, 12, 12, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5,
            8, 1, 21, 1, 21, 1, 11, 1, 21, 74, 1, 1, 5, 3, 1, 3, 15, -1, 1, 0, -1, -1, 2, -1, -1,
            3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 1, -1,
            -1, 1, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 1, -1, -1, 3, -1, -1, 1, 1, 5,
            3, 1, 3, 15, -1, 1, 0, -1, -1, 2, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0,
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
    fn test_main_loop_basic() {
        let inputs = get_shoshin_input();
        let inputs = prepare_args(inputs).unwrap();

        let bytecode = get_shoshin_bytecode();

        execute_cairo_program(&bytecode, "loop", inputs).unwrap();
    }

    #[test]
    fn test_get_frames() {
        let inputs = get_shoshin_input();
        let inputs = prepare_args(inputs).unwrap();

        let bytecode = get_shoshin_bytecode();

        let vm = execute_cairo_program(&bytecode, "loop", inputs).unwrap();
        get_output(vm).unwrap();
    }

    #[test]
    fn test_main_loop_complex() {
        let inputs = get_shoshin_complex_input();
        let inputs = prepare_args(inputs).unwrap();

        let bytecode = get_shoshin_bytecode();

        execute_cairo_program(&bytecode, "loop", inputs).unwrap();
    }
}
