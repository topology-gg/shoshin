///! This crate allows to run the Shoshin loop written in Cairo on the cairo-rs VM.
mod types;
use crate::types::simulation::RealTimeFrameScene;
use crate::types::{FrameScene, RealTimeInputVec, ShoshinInputVec};
use anyhow::Error;
use cairo_execution::{load_program, initialize_cairo_runner, CairoExecutionContext, execute_context};
use cairo_execution::utils::{
    convert_to_felt, convert_to_relocatable, convert_to_structure_vector,
};
use cairo_execution::{execute_cairo_program, utils::prepare_args};
use cairo_felt::{self, Felt};
use cairo_vm::types::program::Program;
use cairo_vm::vm::runners::cairo_runner::CairoRunner;
use cairo_vm::vm::vm_core::VirtualMachine;
use num_traits::ToPrimitive;
use wasm_bindgen::prelude::*;

// it is a program because VM is not clonable
static mut CAIRO_PROGRAM_REALTIME : Option<Program> =  Option::None;


#[wasm_bindgen(start)]
pub fn set_program()  -> Result<(), JsError> {
    let shoshin_bytecode = include_str!("./bytecode_shoshin.json");

    match get_cairo_program( shoshin_bytecode, "playerInLoop") {
        std::result::Result::Ok(cairo_runner) => {
            unsafe { CAIRO_PROGRAM_REALTIME = Some(cairo_runner)};
            Result::Ok(())
        },
        Err(e) => {
            Err(JsError::new(&e.to_string()))
        }
    }
}

pub fn get_cairo_program(shoshin_bytecode: &str, entrypoint: &str) -> Result<Program, Error>{
    match load_program(shoshin_bytecode, entrypoint) {
        std::result::Result::Ok(program) => {
            Result::Ok(program)
        },
        Err(e) => {
            Err(e)
        }
    }
}


#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

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

    let shoshin_bytecode = include_str!("./bytecode_shoshin.json");
    let vm = execute_cairo_program(shoshin_bytecode, "loop", inputs)
        .map_err(|e| JsError::new(&e.to_string()))?;

    let output = get_output(vm).map_err(|e| JsError::new(&e.to_string()))?;
    Result::Ok(serde_wasm_bindgen::to_value(&output)?)
}

/// Wasm binding to the input of the Shoshin loop
/// # Arguments
/// * `inputs` - The flattened inputs to the shoshin loop
///
/// # Returns
/// The extracted output from the shoshin loop
#[wasm_bindgen(js_name = simulateRealtimeFrame)]
pub fn run_realtime_cairo_program_wasm(inputs: Vec<i32>) -> Result<JsValue, JsError> {
    console_log!("inputs vec i32 {:?}", inputs);
    let inputs = RealTimeInputVec(inputs);

    let inputs = prepare_args(inputs).map_err(|e| JsError::new(&e.to_string()))?;

    console_log!("inputs {:?}", inputs);

    
    
    unsafe{
        let program = CAIRO_PROGRAM_REALTIME.to_owned().unwrap();

        let mut vm = VirtualMachine::new(true);
        let cairo_runner : Result<CairoRunner, Error> = initialize_cairo_runner(&mut vm, &program);
        
        match cairo_runner {
            std::result::Result::Ok(cairo_runner) => {
                let mut context = CairoExecutionContext {
                    entrypoint: "playerInLoop".to_string(),
                    program,
                    vm,
                    cairo_runner,
                    inputs,
                };

                execute_context(&mut context).unwrap();

                let output = get_realtime_output(context.vm).map_err(|e| JsError::new(&e.to_string()))?;
                return Result::Ok(serde_wasm_bindgen::to_value(&output)?)
            },
            Err(e) => {
                return Result::Err(JsError::new(&e.to_string()))
            }
        }


    }
    
}

/// Extract the frame scene from the final VM state
/// # Arguments
/// * `vm` - The final VM state after the shoshin loop execution
///
/// # Returns
/// The array of frame scenes
fn get_output(vm: VirtualMachine) -> Result<Vec<FrameScene>, Error> {
    // Handle return values: [frames_len: felt, frames: FrameScene*]
    let return_values = vm.get_return_values(2)?;

    let frames_len = convert_to_felt(&return_values[0])?;
    let frames_len = Felt::to_u32(&frames_len)
        .ok_or_else(|| anyhow::anyhow!("error converting frames length to u32"))?;

    let frames = convert_to_relocatable(&return_values[1])?;

    let output = convert_to_structure_vector::<FrameScene>(frames, frames_len, vm)?;

    Result::Ok(output)
}

/// Extract the RealTimeFrameScene scene from the final VM state
/// # Arguments
/// * `vm` - The final VM state after the shoshin loop execution
///
/// # Returns
/// A Real Time Frame  Scene
fn get_realtime_output(vm: VirtualMachine) -> Result<Vec<RealTimeFrameScene>, Error> {
    // Handle return values: [frames_len: felt, frames: FrameScene*]
    let return_values = vm.get_return_values(2)?;

    //len should be one
    let len = convert_to_felt(&return_values[0])?;
    let len = Felt::to_u32(&len)
        .ok_or_else(|| anyhow::anyhow!("error converting frames length to u32"))?;

    let real_time_frames = convert_to_relocatable(&return_values[1])?;
    //console_log!("real_time_frame {:?}", real_time_frame);

    let output = convert_to_structure_vector::<RealTimeFrameScene>(real_time_frames, 1, vm)?;

    Result::Ok(output)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{vec, time::SystemTime};

    fn get_shoshin_bytecode() -> String {
        std::fs::read_to_string("./bytecode_shoshin.json").unwrap()
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

    fn get_realtime_input() -> Vec<i32> {
        vec![
            0, 1, 1000, 1000, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 1000, 0, 0, 100, 0, 0,
            0, 0, 0, 0, 0, 2, 0, 5, 5, 2, 2, 2, 2, 2, 8, 1, 31, 1, 31, 1, 31, 1, 31, 124, 1, 1, 5,
            3, 1, 3, 15, -1, 1, 0, -1, -1, 2, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0,
            -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 1, -1, -1, 1, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1,
            13, -1, 1, 1, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 2, -1, -1, 3, -1, -1, 3, 1, 5, 2, 1,
            2, 1, -1, -1, 13, -1, 1, 2, -1, -1, 0, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 0, -1, -1,
            2, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1,
            1, 1, -1, -1, 1, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 1, -1, -1, 1, 1, 5, 3,
            1, 3, 15, -1, 1, 2, -1, -1, 3, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 2, -1,
            -1, 0, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 0, -1, -1, 2, -1, -1, 3, 1, 5, 2, 1, 2, 1,
            -1, -1, 13, -1, 1, 0, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 1, -1, -1, 1, -1, -1, 3, 1,
            5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 1, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 2, -1, -1, 3,
            -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 2, -1, -1, 0, -1, -1, 1, 1, 5, 3, 1, 3,
            15, -1, 1, 0, -1, -1, 2, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1, 0, -1, -1, 1,
            1, 5, 3, 1, 3, 15, -1, 1, 1, -1, -1, 1, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1, -1, 13, -1, 1,
            1, -1, -1, 1, 1, 5, 3, 1, 3, 15, -1, 1, 2, -1, -1, 3, -1, -1, 3, 1, 5, 2, 1, 2, 1, -1,
            -1, 13, -1, 1, 2, -1, -1, 0, -1, -1, 0, 3, 24, 8, 7, 39, 1, 1, 5, 12, 1, 3, 14, -1, 1,
            110, -1, -1, 10, -1, -1, 1, 1, 5, 12, 1, 3, 14, -1, 1, 110, -1, -1, 20, -1, -1, 1, 1,
            5, 12, 1, 3, 14, -1, 1, 110, -1, -1, 30, -1, -1, 1, 1, 5, 12, 1, 3, 14, -1, 1, 110, -1,
            -1, 1010, -1, -1, 12, 1, 3, 14, -1, 1, 110, -1, -1, 1020, -1, -1, 10, 1, 7, 6, -1, 1,
            2, 1, 3, 14, -1, 1, 1, -1, -1, 14, -1, 1, 101, -1, -1, 80, -1, -1, 10, 1, 2, 200, -1,
            -1, 2, 1, 3, 14, -1, 1, 1, -1, -1, 14, -1, 1, 101, -1, -1, 4, 0, 101, 3, 6,
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

        let bytecode = include_str!("./bytecode_shoshin.json");

        let vm = execute_cairo_program(&bytecode, "loop", inputs).unwrap();
        get_output(vm).unwrap();
    }

    #[test]
    fn test_realtime_output() {
        let inputs = get_realtime_input();
        println!("{:?} : start RealTimeInputVec", SystemTime::now().duration_since(SystemTime::UNIX_EPOCH));
        let inputs = RealTimeInputVec(inputs);
        println!("{:?} : start prepare_args", SystemTime::now().duration_since(SystemTime::UNIX_EPOCH));
        let inputs = prepare_args(inputs).unwrap();

        let bytecode = include_str!("./bytecode_shoshin.json");
        
        println!("{:?} : start execute_cairo_program", SystemTime::now().duration_since(SystemTime::UNIX_EPOCH));
        let vm = execute_cairo_program(&bytecode, "playerInLoop", inputs).unwrap();

        println!("{:?} : start get_realtime_output", SystemTime::now().duration_since(SystemTime::UNIX_EPOCH));
        let output = get_realtime_output(vm).unwrap();
        
        println!("{:?} : done with get_realtime_output", SystemTime::now().duration_since(SystemTime::UNIX_EPOCH));

        assert!(1 == 1);
    }
}
