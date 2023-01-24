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

macro_rules! bigint {
    ($val : expr) => {
        Into::<BigInt>::into($val)
    };
}

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

    let char_0 = shoshin_input.char_0;
    let char_1 = shoshin_input.char_1;
    let mut inputs = shoshin_input.get_vector_arguments();
    let actions_1 = num_into_mayberelocatable(inputs.pop().unwrap());
    let actions_0 = num_into_mayberelocatable(inputs.pop().unwrap());
    let functions_1 = num_into_mayberelocatable(inputs.pop().unwrap());
    let functions_offset_1 = num_into_mayberelocatable(inputs.pop().unwrap());
    let functions_0 = num_into_mayberelocatable(inputs.pop().unwrap());
    let functions_offset_0 = num_into_mayberelocatable(inputs.pop().unwrap());
    let state_machine_1 = num_into_mayberelocatable(inputs.pop().unwrap());
    let state_machine_offset_1 = num_into_mayberelocatable(inputs.pop().unwrap());
    let state_machine_0 = num_into_mayberelocatable(inputs.pop().unwrap());
    let state_machine_offset_0 = num_into_mayberelocatable(inputs.pop().unwrap());
    let combos_1 = num_into_mayberelocatable(inputs.pop().unwrap());
    let combos_offset_1 = num_into_mayberelocatable(inputs.pop().unwrap());
    let combos_0 = num_into_mayberelocatable(inputs.pop().unwrap());
    let combos_offset_0 = num_into_mayberelocatable(inputs.pop().unwrap());

    let range_check = CairoArg::from(MaybeRelocatable::from((2, 0)));
    let frames = CairoArg::from(mayberelocatable!(120));
    let c_o_0_len = CairoArg::from(mayberelocatable!(combos_offset_0.len()));
    let c_o_0 = CairoArg::from(combos_offset_0);
    let c_0_len = CairoArg::from(mayberelocatable!(combos_0.len()));
    let c_0 = CairoArg::from(combos_0);
    let c_o_1_len = CairoArg::from(mayberelocatable!(combos_offset_1.len()));
    let c_o_1 = CairoArg::from(combos_offset_1);
    let c_1_len = CairoArg::from(mayberelocatable!(combos_1.len()));
    let c_1 = CairoArg::from(combos_1);
    let s_m_o_0_len = CairoArg::from(mayberelocatable!(state_machine_offset_0.len()));
    let s_m_o_0 = CairoArg::from(state_machine_offset_0);
    let s_m_0_len = CairoArg::from(mayberelocatable!(state_machine_0.len() / 3));
    let s_m_0 = CairoArg::from(state_machine_0);
    let initial_state_0 = CairoArg::from(mayberelocatable!(0));
    let s_m_o_1_len = CairoArg::from(mayberelocatable!(state_machine_offset_1.len()));
    let s_m_o_1 = CairoArg::from(state_machine_offset_1);
    let s_m_1_len = CairoArg::from(mayberelocatable!(state_machine_1.len() / 3));
    let s_m_1 = CairoArg::from(state_machine_1);
    let initial_state_1 = CairoArg::from(mayberelocatable!(0));
    let f_o_0_len = CairoArg::from(mayberelocatable!(functions_offset_0.len()));
    let f_o_0 = CairoArg::from(functions_offset_0);
    let f_0_len = CairoArg::from(mayberelocatable!(functions_0.len() / 3));
    let f_0 = CairoArg::from(functions_0);
    let f_o_1_len = CairoArg::from(mayberelocatable!(functions_offset_1.len()));
    let f_o_1 = CairoArg::from(functions_offset_1);
    let f_1_len = CairoArg::from(mayberelocatable!(functions_1.len() / 3));
    let f_1 = CairoArg::from(functions_1);
    let a_0_len = CairoArg::from(mayberelocatable!(actions_0.len()));
    let a_0 = CairoArg::from(actions_0);
    let a_1_len = CairoArg::from(mayberelocatable!(actions_1.len()));
    let a_1 = CairoArg::from(actions_1);
    let char_0 = CairoArg::from(mayberelocatable!(char_0));
    let char_1 = CairoArg::from(mayberelocatable!(char_1));

    let args = vec![
        &range_check,
        &frames,
        &c_o_0_len,
        &c_o_0,
        &c_0_len,
        &c_0,
        &c_o_1_len,
        &c_o_1,
        &c_1_len,
        &c_1,
        &s_m_o_0_len,
        &s_m_o_0,
        &s_m_0_len,
        &s_m_0,
        &initial_state_0,
        &s_m_o_1_len,
        &s_m_o_1,
        &s_m_1_len,
        &s_m_1,
        &initial_state_1,
        &f_o_0_len,
        &f_o_0,
        &f_0_len,
        &f_0,
        &f_o_1_len,
        &f_o_1,
        &f_1_len,
        &f_1,
        &a_0_len,
        &a_0,
        &a_1_len,
        &a_1,
        &char_0,
        &char_1,
    ];

    cairo_runner.run_from_entrypoint(entrypoint, &args, false, &mut vm, &mut hint_processor)?;
    Ok(vm)
}

fn num_into_mayberelocatable<T: Into<BigInt>>(x: Vec<T>) -> Vec<MaybeRelocatable> {
    let mut y = vec![];
    for i in x {
        y.push(mayberelocatable!(i));
    }
    y
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
    use super::*;

    #[test]
    fn test_main_loop() {
        let combos_offset_0 = vec![mayberelocatable!(0), mayberelocatable!(1)];
        let combos_0 = vec![
            mayberelocatable!(1),
            mayberelocatable!(1),
            mayberelocatable!(1),
            mayberelocatable!(1),
            mayberelocatable!(1),
        ];
        run_cairo_program(combos_offset_0, combos_0).unwrap();
    }

    #[test]
    fn test_get_frames() {
        let combos_offset_0 = vec![mayberelocatable!(0), mayberelocatable!(1)];
        let combos_0 = vec![
            mayberelocatable!(1),
            mayberelocatable!(1),
            mayberelocatable!(1),
            mayberelocatable!(1),
            mayberelocatable!(1),
        ];
        let vm = run_cairo_program(combos_offset_0, combos_0).unwrap();
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
