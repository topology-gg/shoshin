pragma circom 2.0.0;
include "../circomlib/circuits/comparators.circom";

template Abs(WORD_SIZE) {
	component lt = LessThan(WORD_SIZE);
	signal input inp;
	signal output out;
	signal output is_neg;
	inp ==> lt.in[0];
	0 ==> lt.in[1];
	out <== (1 - 2 * lt.out) * inp;
	is_neg <== lt.out;
}

/**
* Get the quotient and remainder of **positive** integers
*/
template IntegerDivideRemainder(WORD_SIZE) {
	signal input inp[2];
	signal output quotient;
	signal output remainder;
	component lt_r = LessThan(WORD_SIZE);
	component gte_r = GreaterEqThan(WORD_SIZE);

	component lte_q = LessEqThan(WORD_SIZE);
	component gte_q = GreaterEqThan(WORD_SIZE);

	// component is_denom_zero = IsZero();

	// inp[1] ==> is_denom_zero.in;

	// To handle division by zero, we tree division by zero as setting the quotient to zero
	// and the remainder to zero
	quotient <-- inp[1] != 0 ? inp[0] \ inp[1] : 0; //(inp[0] \ (inp[1] + is_denom_zero.out)) * (1 - is_denom_zero.out);
	remainder <-- inp[1] != 0 ? inp[0] % inp[1] : 0; //(inp[0] % (inp[1] + is_denom_zero.out)) * (1 - is_denom_zero.out);

	// Check that for a / b, a = b * q + r
	inp[0] === inp[1] * quotient + remainder;

	//  Check that 0 <= remainder < b
	remainder ==> gte_r.in[0];
	0 ==> gte_r.in[1];
	remainder ==> lt_r.in[0];
	inp[1] ==> lt_r.in[1];
	lt_r.out === 1;

	//  Check that 0 <= remainder < b
	quotient ==> gte_q.in[0];
	0 ==> gte_q.in[1];
	gte_q.out === 1;
	quotient ==> lte_q.in[0];
	inp[0] ==> lte_q.in[1];
	lte_q.out === 1;
}

