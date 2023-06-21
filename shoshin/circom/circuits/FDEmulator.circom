pragma circom 2.0.0;

include "../circomlib/circuits/multiplexer.circom";
include "../circomlib/circuits/mux1.circom";
include "../circomlib/circuits/mux2.circom";
include "../circomlib/circuits/comparators.circom";
include "../circomlib/circuits/gates.circom";
include "./Operators.circom";

template OpTraceALU(WORD_SIZE) {
	signal input inp[2];
	signal input type_sel;
	signal output out;

	// Support 13 operations as per the opcodes but have ``dummmy'' outputs for the unset ones
	// We do not count MEM=13, DICT=14, FUNC=15 here
	var n_operations = 13; 
	component mux = Multiplexer(1, n_operations);
	type_sel ==> mux.sel;

	/************ Null 0 Op, Pass inp[0] into the current out *************/
	inp[0] ==> mux.inp[0][0];

	/************ Arithmetic Operators ****************/
	component abs_num = Abs(WORD_SIZE);
	component abs_denom = Abs(WORD_SIZE);
	component divide_mod = IntegerDivideRemainder(WORD_SIZE);
	// Set up the absolute value
	inp[0] ==> abs_num.inp;
	inp[1] ==> abs_denom.inp;

	inp[0] + inp[1] ==> mux.inp[1][0];
	inp[0] - inp[1] ==> mux.inp[2][0];
	inp[0] * inp[1] ==> mux.inp[3][0];

	// Quotient
	// The XOR of numerator and divisor sign
	signal quotient_is_neg;
	quotient_is_neg <== abs_denom.is_neg + abs_num.is_neg - 2 * abs_denom.is_neg * abs_num.is_neg;
	abs_num.out ==> divide_mod.inp[0];
	abs_denom.out ==> divide_mod.inp[1];
	divide_mod.quotient * (1 - 2 * quotient_is_neg) ==> mux.inp[4][0];

	//  Mod Opcode Disabled
	0 ==> mux.inp[5][0];

	abs_num.out ==> mux.inp[6][0];

	//  SQRT Opcode Disabled
	0 ==> mux.inp[7][0];
	//  Pow Opcode Disabled
	0 ==> mux.inp[8][0];

	/************ Conditional Operators ****************/
	component eq = IsEqual();
	component lt = LessThan(WORD_SIZE);
	component lte = LessEqThan(WORD_SIZE);

	// IS_NN
	(1 - abs_num.is_neg) ==> mux.inp[9][0];

	// IS_LE
	inp[0] ==> lte.in[0];
	inp[1] ==> lte.in[1];
	lte.out ==> mux.inp[10][0];

	// NOT
	1 - inp[0] ==> mux.inp[11][0];

	// EQ
	inp[0] ==> eq.in[0];
	inp[1] ==> eq.in[1];
	eq.out ==> mux.inp[12][0];

	mux.out[0] ==> out;
}

/**
 * A simple wrapper to mux between to arrays, inputs and traces
 */
template OpTrace(INPUT_SIZE, AVAILABLE_TRACES, WORD_SIZE) {
	signal input sel_inp_a;	
	signal input sel_inp_b;	
	signal input sel_type;
	signal input inputs[INPUT_SIZE];
	signal input available_traces[AVAILABLE_TRACES];
	signal output out;

	component muxA = Multiplexer(1, INPUT_SIZE + AVAILABLE_TRACES);
	component muxB = Multiplexer(1, INPUT_SIZE + AVAILABLE_TRACES);

	for (var i = 0; i < INPUT_SIZE; i++) {
		inputs[i] ==> muxA.inp[i][0];
		inputs[i] ==> muxB.inp[i][0];
	}
	for (var i = 0; i < AVAILABLE_TRACES; i++) {
		available_traces[i] ==> muxA.inp[INPUT_SIZE + i][0];
		available_traces[i] ==> muxB.inp[INPUT_SIZE + i][0];
	}
	sel_inp_a ==> muxA.sel;
	sel_inp_b ==> muxB.sel;
	
	component buff = OpTraceALU(WORD_SIZE);
	muxA.out[0] ==> buff.inp[0];
	muxB.out[0] ==> buff.inp[1];
	sel_type ==> buff.type_sel;
	buff.out ==> out;
}

template FD_Emulator(
	INPUT_SIZE,
	N_TRACES,
	WORD_SIZE
) {  
	// We require the WORD_SIZE to be less than 1/2 of the the bit size of |p| so that we
	// can get away with integer division on the raw numbers
	// I.e. for a // b = q and a % b = c,
	// integer division can easily be verified by checking that b * q + c = a, 0 <= c < b, 0 < q < a
	// Note that we require b * q < p as to not overflow/ wrap around the modulus. Thus, if 2 * word sizes + 1
	// is less than the word size of p, (q * b + a) < p and no overflowing occurs
	assert(WORD_SIZE < 119);

	signal input inputs[INPUT_SIZE];
	signal input trace_inp_selectors[N_TRACES][2];
	signal input trace_type_selectors[N_TRACES];
	signal output out;

	component op_traces[N_TRACES];
	
	for (var i = 0; i < N_TRACES; i++) {
		op_traces[i] = OpTrace(INPUT_SIZE, i, WORD_SIZE);
		for (var x = 0; x < INPUT_SIZE; x++) inputs[x] ==> op_traces[i].inputs[x];
		for (var x = 0; x < i; x++) op_traces[x].out ==> op_traces[i].available_traces[x];
		trace_inp_selectors[i][0] ==> op_traces[i].sel_inp_a;
		trace_inp_selectors[i][1] ==> op_traces[i].sel_inp_b;
		trace_type_selectors[i] ==> op_traces[i].sel_type;
	}
	out <== op_traces[N_TRACES - 1].out;
}