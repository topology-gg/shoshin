///! This crate allows to run the Shoshin loop written in Cairo on the cairo-rs VM.
mod types;
mod utils;
use anyhow::{Error, Ok};
use cairo_felt::{self, Felt};
use cairo_vm::types::relocatable::Relocatable;
use cairo_vm::{
    hint_processor::builtin_hint_processor::builtin_hint_processor_definition::BuiltinHintProcessor,
    types::{program::Program, relocatable::MaybeRelocatable},
    vm::{
        runners::cairo_runner::{CairoArg, CairoRunner},
        vm_core::VirtualMachine,
    },
};
use num_bigint::BigInt;
use std::collections::VecDeque;
use std::io::Cursor;
use types::{FrameScene, ShoshinInput, Sizeable};
use wasm_bindgen::prelude::*;

/// Runs the Shoshin cairo compiled bytecode located in ./compiled_loop.json
/// against the inputs provided.
/// # Arguments
/// * `shoshin_input` - The structure containing inputs to the shoshin loop
///
/// # Returns
/// The final VM state
pub fn run_cairo_program(shoshin_input: ShoshinInput) -> Result<VirtualMachine, Error> {
    // Prepare the cairo runner, the vm and an empty hint processor
    const PROGRAM_JSON: &str = include_str!("./compiled_loop.json");
    let program = Program::from_reader(Cursor::new(PROGRAM_JSON), Some("loop"))?;

    let mut cairo_runner = CairoRunner::new(&program, "all", false)?;
    let mut vm = VirtualMachine::new(true);

    let mut hint_processor = BuiltinHintProcessor::new_empty();

    let entrypoint = program
        .identifiers
        .get(&format!("__main__.{}", "loop"))
        .unwrap()
        .pc
        .unwrap();

    cairo_runner.initialize_builtins(&mut vm)?;
    cairo_runner.initialize_segments(&mut vm, None);

    // Append the range_check_ptr and frames count to the arguments
    let mut args = vec![
        CairoArg::from(MaybeRelocatable::from((2, 0))),
        CairoArg::from(mayberelocatable!(120)),
    ];
    let mut user_args = shoshin_input.into();
    args.append(&mut user_args);

    cairo_runner
        .run_from_entrypoint(
            entrypoint,
            &args.iter().collect::<Vec<&CairoArg>>(),
            false,
            &mut vm,
            &mut hint_processor,
        )
        .unwrap();
    Ok(vm)
}

/// Extract the frame scene from the final VM state
/// # Arguments
/// * `vm` - The final VM state after the shoshin loop execution
///
/// # Returns
/// The array of frame scenes casted to a JsValue
fn extract_output(vm: VirtualMachine) -> Result<Vec<FrameScene>, Error> {
    // Prepare frames and frames size
    let frames_size = FrameScene::size(&FrameScene::default()) as u32;
    let mut frames = vec![];

    // Handle return values: (frames_len: felt, frames: FrameScene*)
    if let [len_re, frames_re] = &vm.get_return_values(2)?[..] {
        let len = len_re.get_int_ref().unwrap().to_bigint().to_u32_digits().1[0];
        let frames_address = frames_re.get_relocatable().unwrap();

        // Loop the memory segment in frames_address len times, extracting each integer
        for i in 0..len {
            let mut frame = VecDeque::new();

            for j in 0..frames_size {
                let word_address = Relocatable {
                    segment_index: frames_address.segment_index,
                    offset: (i * frames_size + j) as usize,
                };
                frame.push_back(vm.get_integer(word_address).unwrap().to_bigint());
            }
            frames.push(FrameScene::from(frame));
        }
    }
    Result::Ok(frames)
}

/// Wasm binding to the input of the Shoshin loop
/// # Arguments
/// * `inputs` - The flattened inputs to the shoshin loop
///
/// # Returns
/// The extracted output from the shoshin loop
#[wasm_bindgen(js_name = runCairoProgram)]
pub fn run_cairo_program_wasm(inputs: Vec<i32>) -> Result<JsValue, JsError> {
    // Run the shoshin cairo program with the inputs
    let vm = run_cairo_program(ShoshinInput::from(inputs)).unwrap();
    match extract_output(vm) {
        Result::Ok(x) => Result::Ok(serde_wasm_bindgen::to_value(&x)?),
        Result::Err(e) => Result::Err(JsError::new(&e.to_string())),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::vec;

    fn get_shoshin_test_input() -> Vec<i32> {
        vec![
            2, 0, 1, 5, 2, 2, 2, 2, 2, 2, 0, 1, 5, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, -1, -1, 0, 2, 1,
            1, 1, 0, -1, -1, 0, 1, 1, 1, 0, -1, -1, 1, 1, 1, 0, -1, -1, 1, 101, 1, 101, 0, 1,
        ]
    }

    #[test]
    fn test_main_loop() {
        let mut shoshin_input = ShoshinInput::from(get_shoshin_test_input());
        shoshin_input.char_1 = 1;
        run_cairo_program(shoshin_input).unwrap();
    }

    #[test]
    fn test_get_frames() {
        let mut shoshin_input = ShoshinInput::from(get_shoshin_test_input());
        shoshin_input.char_1 = 1;
        let vm = run_cairo_program(shoshin_input).unwrap();
        extract_output(vm).unwrap();
    }
}
