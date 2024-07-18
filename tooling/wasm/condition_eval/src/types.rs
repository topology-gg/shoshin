use cairo_derive::CairoArgs;
use cairo_felt::{self, Felt};
use cairo_types::{bigint, mayberelocatable, KeyValuePair, Sizeable, Tree};
use cairo_vm::types::relocatable::MaybeRelocatable;
use cairo_vm::vm::runners::cairo_runner::CairoArg;
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};

#[derive(Debug, CairoArgs)]
struct ConditionEvaluationInputs {
    _condition: Vec<Tree>,
    _dict: Vec<KeyValuePair>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConditionEvaluationOutput {
    pub evaluation: u32,
}
