///! This crate allows to run Cairo bytecode on the cairo rust VM.
#[macro_use]
mod utils;
use anyhow::{Error, Ok};
use cairo_vm::{
    hint_processor::builtin_hint_processor::builtin_hint_processor_definition::BuiltinHintProcessor,
    types::program::Program,
    vm::{
        runners::cairo_runner::{CairoArg, CairoRunner},
        vm_core::VirtualMachine,
    },
};
use std::io::Cursor;

#[derive(thiserror::Error, Debug)]
pub enum CairoExecutionError {
    #[error("Error initializing: {0}")]
    InitializationError(String),
    #[error("Error loading the Cairo program at {0}")]
    CairoProgramLoadError(String),
    #[error("Error running the Cairo context: {0}")]
    CairoContextExecutionError(String),
}

struct CairoExecutionContext {
    entrypoint: String,
    program: Program,
    inputs: Vec<CairoArg>,
    vm: VirtualMachine,
    cairo_runner: CairoRunner,
}

/// Runs the Cairo compiled bytecode
/// against the inputs provided.
/// # Arguments
/// * `bytecode` - The Cairo bytecode
/// * `entrypoint` - The entrypoint to the program
/// * `input` - The inputs to the program
///
/// # Returns
/// The final VM state
pub fn execute_cairo_program(
    bytecode: &str,
    entrypoint: &str,
    inputs: Vec<CairoArg>,
) -> Result<VirtualMachine, Error> {
    let mut context = initialize_cairo_execution_context(bytecode, entrypoint, inputs)
        .map_err(|e| CairoExecutionError::InitializationError(e.to_string()))?;

    execute_context(&mut context)?;

    Result::Ok(context.vm)
}

fn initialize_cairo_execution_context(
    bytecode: &str,
    entrypoint: &str,
    inputs: Vec<CairoArg>,
) -> Result<CairoExecutionContext, Error> {
    let mut vm = VirtualMachine::new(true);
    let program = load_program(bytecode, entrypoint)?;
    let cairo_runner = initialize_cairo_runner(&mut vm, &program)?;

    Ok(CairoExecutionContext {
        entrypoint: entrypoint.to_string(),
        program,
        vm,
        cairo_runner,
        inputs,
    })
}

fn load_program(bytecode: &str, entrypoint: &str) -> Result<Program, Error> {
    Ok(Program::from_reader(
        Cursor::new(bytecode),
        Some(entrypoint),
    )?)
}

fn initialize_cairo_runner(
    vm: &mut VirtualMachine,
    program: &Program,
) -> Result<CairoRunner, Error> {
    let mut cairo_runner = CairoRunner::new(program, "all", false)?;
    cairo_runner.initialize_builtins(vm)?;
    cairo_runner.initialize_segments(vm, None);
    Result::Ok(cairo_runner)
}

fn execute_context(context: &mut CairoExecutionContext) -> Result<(), Error> {
    let entrypoint_pc = get_entrypoint_pc(context)?;
    let mut hint_processor = BuiltinHintProcessor::new_empty();

    context
        .cairo_runner
        .run_from_entrypoint(
            entrypoint_pc,
            &context.inputs.iter().collect::<Vec<&CairoArg>>(),
            false,
            &mut context.vm,
            &mut hint_processor,
        )
        .map_err(|e| CairoExecutionError::CairoContextExecutionError(e.to_string()))?;

    Ok(())
}

fn get_entrypoint_pc(context: &CairoExecutionContext) -> Result<usize, Error> {
    let entrypoint = context
        .program
        .identifiers
        .get(&format!("__main__.{}", context.entrypoint))
        .unwrap()
        .pc
        .unwrap();
    Ok(entrypoint)
}
