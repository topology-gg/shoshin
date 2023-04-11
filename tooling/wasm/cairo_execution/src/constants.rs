use cairo_felt::{FIELD_HIGH, FIELD_LOW};
use lazy_static::lazy_static;
use num_bigint::BigInt;

lazy_static! {
    pub static ref PRIME: BigInt = (BigInt::from(FIELD_HIGH) << 128) + BigInt::from(FIELD_LOW);
    pub static ref PRIME_HALF: BigInt = &*PRIME >> 1;
}
