use cairo_derive::{CairoArgs, CairoStruct};
use cairo_felt::{self, Felt};
use cairo_types::{bigint, mayberelocatable, Base32, KeyValuePair, Sizeable, Tree};
use cairo_vm::types::relocatable::MaybeRelocatable;
use cairo_vm::vm::runners::cairo_runner::CairoArg;
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};

#[derive(Debug, CairoArgs)]
struct ConditionEvaluationInputs {
    _condition: Vec<Tree>,
    _mem: Vec<Base32>,
    _dict: Vec<KeyValuePair>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConditionEvaluationOutput {
    pub evaluation: u32,
    pub mem: Vec<Memory>,
}

#[derive(Serialize, Deserialize, Debug, CairoStruct)]
pub struct Memory {
    pub value: BigInt,
}

impl Sizeable for Memory {
    fn size() -> usize {
        1
    }
}
