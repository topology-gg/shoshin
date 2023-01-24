mod types;
use anyhow::{Error, Ok};
use cairo_felt::FeltOps;
use cairo_felt::{self, Felt, NewFelt};
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
use types::{FrameScene, ShoshinInput};
use wasm_bindgen::prelude::*;

#[macro_export]
macro_rules! bigint {
    ($val : expr) => {
        Into::<BigInt>::into($val)
    };
}

#[macro_export]
macro_rules! mayberelocatable {
    ($val1 : expr, $val2 : expr) => {
        MaybeRelocatable::from(($val1, $val2))
    };
    ($val1 : expr) => {
        MaybeRelocatable::from(Felt::new(bigint!($val1)))
    };
}

pub fn run_cairo_program(shoshin_input: ShoshinInput) -> Result<VirtualMachine, Error> {
    const PROGRAM_JSON: &str = include_str!("./compiled_loop.json");
    let program = Program::from_reader(Cursor::new(PROGRAM_JSON), Some("loop"))?;

    let mut cairo_runner = CairoRunner::new(&program, "all", false).unwrap();
    let mut vm = VirtualMachine::new(true);

    let mut hint_processor = BuiltinHintProcessor::new_empty();

    let entrypoint = program
        .identifiers
        .get(&format!("__main__.{}", "loop"))
        .unwrap()
        .pc
        .unwrap();

    cairo_runner.initialize_builtins(&mut vm).unwrap();
    cairo_runner.initialize_segments(&mut vm, None);

    let mut args = vec![
        CairoArg::from(MaybeRelocatable::from((2, 0))),
        CairoArg::from(mayberelocatable!(120)),
    ];
    let mut user_args = shoshin_input.get_vm_args();
    args.append(&mut user_args);

    cairo_runner.run_from_entrypoint(
        entrypoint,
        &args.iter().collect::<Vec<&CairoArg>>()[..],
        false,
        &mut vm,
        &mut hint_processor,
    )?;
    Ok(vm)
}

#[wasm_bindgen(js_name = runCairoProgram)]
pub fn run_cairo_program_wasm(shoshin_input: ShoshinInput) -> Result<JsValue, JsError> {
    let vm = run_cairo_program(shoshin_input).unwrap();
    let frames_size = 44;
    let mut frames = vec![];
    if let [len_re, frames_re] = &vm.get_return_values(2).unwrap()[..] {
        let len = len_re.get_int_ref().unwrap().to_bigint().to_u32_digits().1[0];
        let frames_address = frames_re.get_relocatable().unwrap();
        for i in 0..len {
            let mut frame = VecDeque::new();
            for j in 0..frames_size {
                let word_address = Relocatable {
                    segment_index: frames_address.segment_index,
                    offset: (i * frames_size + j) as usize,
                };
                frame.push_back(vm.get_integer(&word_address).unwrap().to_bigint());
            }
            frames.push(FrameScene::from(frame));
        }
    }
    Result::Ok(serde_wasm_bindgen::to_value(&frames).unwrap())
}

#[cfg(test)]
mod tests {
    use std::vec;

    use super::*;

    fn get_shoshin_input() -> Vec<Vec<i32>> {
        vec![
            vec![0, 1],
            vec![2, 2, 2, 2, 2],
            vec![0, 1],
            vec![2, 2, 2, 2, 2],
            vec![1, 1],
            vec![0, -1, -1],
            vec![1, 1],
            vec![0, -1, -1],
            vec![0],
            vec![0, -1, -1],
            vec![0],
            vec![0, -1, -1],
            vec![101],
            vec![101],
        ]
    }

    #[test]
    fn test_main_loop() {
        let mut shoshin_input = ShoshinInput::from(get_shoshin_input());
        shoshin_input.char_1 = 1;
        run_cairo_program(shoshin_input).unwrap();
    }

    #[test]
    fn test_get_frames() {
        let mut shoshin_input = ShoshinInput::from(get_shoshin_input());
        shoshin_input.char_1 = 1;
        let vm = run_cairo_program(shoshin_input).unwrap();
        let frames_size = 44;
        let mut frames = vec![];
        if let [len_re, frames_re] = &vm.get_return_values(2).unwrap()[..] {
            let len = len_re.get_int_ref().unwrap().to_bigint().to_u32_digits().1[0];
            let frames_address = frames_re.get_relocatable().unwrap();
            for i in 0..len {
                let mut frame = VecDeque::new();
                for j in 0..frames_size {
                    let word_address = Relocatable {
                        segment_index: frames_address.segment_index,
                        offset: (i * frames_size + j) as usize,
                    };
                    frame.push_back(vm.get_integer(&word_address).unwrap().to_bigint());
                }
                frames.push(FrameScene::from(frame));
            }
        }
    }
}
