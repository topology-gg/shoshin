use anyhow::Error;
use cairo_vm::{types::relocatable::MaybeRelocatable, vm::runners::cairo_runner::CairoArg};
use std::convert::Into;

/// Convert Vec<i32> to Vec<CairoArg>
/// # Arguments
/// * `inputs` - The flattened inputs to the cairo program
///
/// # Returns
/// The inputs converted to CairoArgs
pub fn prepare_args<T: Into<Vec<CairoArg>>>(inputs: T) -> Result<Vec<CairoArg>, Error> {
    let range_check_ptr = MaybeRelocatable::from((2, 0));

    let mut args = vec![CairoArg::from(range_check_ptr)];
    args.extend(Into::<Vec<CairoArg>>::into(inputs));

    Ok(args)
}
