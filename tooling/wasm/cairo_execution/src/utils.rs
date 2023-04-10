use crate::constants::{PRIME, PRIME_HALF};
use anyhow::{Error, Ok};
use cairo_felt::Felt;
use cairo_types::Sizeable;
use cairo_vm::{
    types::relocatable::{MaybeRelocatable, Relocatable},
    vm::{runners::cairo_runner::CairoArg, vm_core::VirtualMachine},
};
use num_bigint::BigInt;
use std::{convert::Into, ops::Sub};

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

/// Convert a cairo_vm Relocatable to an array of structures
/// # Arguments
/// * `reloc` - The relocatable cairo data
/// * `len` - The number of elements in the output
/// * `vm` - The final VM state after the cairo program execution
///
/// # Returns
/// The extracted output from the cairo program
pub fn convert_to_structure_vector<T: From<*mut Vec<BigInt>> + Sizeable>(
    reloc: Relocatable,
    len: u32,
    vm: VirtualMachine,
) -> Result<Vec<T>, Error> {
    let mut output = vec![];

    for i in 0..len {
        let mut flattened_structure = convert_to_bigint_vector::<T>(reloc, i, &vm)?;
        convert_field_elements_to_bigints(&mut flattened_structure);

        let ptr = Box::into_raw(Box::new(flattened_structure));
        let structure: T = T::from(ptr);
        output.push(structure);
    }

    Ok(output)
}

fn convert_to_bigint_vector<T: Sizeable>(
    reloc: Relocatable,
    initial_offset: u32,
    vm: &VirtualMachine,
) -> Result<Vec<BigInt>, Error> {
    let structure_size = T::size() as u32;
    let mut result = Vec::new();

    // Reverse the memory iteration, in order to be able to .pop() starting from the first value in
    // the memory segment
    for j in (0..structure_size).rev() {
        let word_address = Relocatable {
            segment_index: reloc.segment_index,
            offset: (initial_offset * structure_size + j) as usize,
        };
        result.push(vm.get_integer(word_address).unwrap().to_bigint());
    }
    Ok(result)
}

/// Convert a cairo_vm MaybeRelocatable to number
/// # Arguments
/// * `maybe_reloc` - The maybe relocatable cairo data
///
/// # Returns
/// The extracted number from the cairo program
pub fn convert_to_felt(maybe_reloc: &MaybeRelocatable) -> Result<Felt, Error> {
    let felt = maybe_reloc
        .get_int_ref()
        .map_err(|e| anyhow::anyhow!(e.to_string()))?;

    let mut output = felt.to_bigint();
    sign_integer(&mut output);

    Ok(output.into())
}

/// Convert a cairo_vm MaybeRelocatable to Relocatable
/// # Arguments
/// * `maybe_reloc` - The maybe relocatable cairo data
///
/// # Returns
/// The extracted relocatable from the cairo program
pub fn convert_to_relocatable(maybe_reloc: &MaybeRelocatable) -> Result<Relocatable, Error> {
    Ok(maybe_reloc
        .get_relocatable()
        .map_err(|e| anyhow::anyhow!(e.to_string()))?)
}

fn convert_field_elements_to_bigints(x: &mut [BigInt]) {
    x.iter_mut().for_each(sign_integer);
}

/// Convert a starknet bigint field element to a signed BigInt in place
fn sign_integer(x: &mut BigInt) {
    if *x > *PRIME_HALF {
        *x = BigInt::new(
            num_bigint::Sign::Minus,
            (&*PRIME).sub(&*x).to_u32_digits().1,
        );
    }
}
