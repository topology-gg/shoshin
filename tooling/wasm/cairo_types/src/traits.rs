use cairo_vm::vm::runners::cairo_runner::CairoArg;

/// Trait defining how to convert a type to CairoArg
pub trait IntoCairoArgs {
    fn into(self) -> CairoArg;
}

/// Trait defining how to convert &[i32] into our type
pub trait FromSliceBase32 {
    fn from(input: &[i32]) -> Self;
}

/// Trait defining the size of a cairo struct (amount of felts
/// required to represent the structure)
pub trait Sizeable {
    fn size(&self) -> usize;
}
