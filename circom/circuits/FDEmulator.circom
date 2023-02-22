pragma circom 2.0.0;

include "../circomlib/circuits/multiplexer.circom";
include "../circomlib/circuits/mux1.circom";
include "../circomlib/circuits/mux2.circom";
include "../circomlib/circuits/comparators.circom";
include "../circomlib/circuits/gates.circom";

/* A simple wrapper to mux between to arrays, inputs and buffers */
template InputAndBufferMux(INPUT_SIZE, INPUT_BUFFER_SIZE) {
	component mux = Multiplexer(1, INPUT_SIZE + INPUT_BUFFER_SIZE);
	signal input inputs[INPUT_SIZE];
	signal input buffers[INPUT_BUFFER_SIZE];
	signal input sel;
	signal output out;

	for (var i = 0; i < INPUT_SIZE; i++) {
		inputs[i] ==> mux.inp[i][0];
	}
	for (var i = 0; i < INPUT_BUFFER_SIZE; i++) {
		buffers[i] ==> mux.inp[INPUT_SIZE + i][0];
	}
	sel ==> mux.sel;
	mux.out[0] ==> out;
}

template MuxedComparator(N_WORD_BITS) {
	signal input inp[2];
	signal output out;
	signal input sel[2];

	component mux = Mux2();
	component eq = IsEqual();
	component lt = LessThan(N_WORD_BITS);
	component lte = LessEqThan(N_WORD_BITS);

	inp[0] ==> eq.in[0];
	inp[1] ==> eq.in[1];
	eq.out ==> mux.c[0];

	inp[0] ==> lt.in[0];
	inp[1] ==> lt.in[1];
	lt.out ==> mux.c[1];

	inp[0] ==> lte.in[0];
	inp[1] ==> lte.in[1];
	lte.out ==> mux.c[2];

	// Not equal
	mux.c[3] <== 1 - eq.out;

	sel[0] ==> mux.s[0];
	sel[1] ==> mux.s[1];

	// mux.out ==> out;
	out <== mux.out;
}

/**
 * Set the **first** conditional which is true to true. Make the rest false
 * This will be done via a duel XORing construction where we keep an accumulator
 * and the modified output signals
 */
template FirstTrue(N_OUTPUT_CONDITIONALS) {
	signal input bool_inps[N_OUTPUT_CONDITIONALS];
	signal output bool_outs[N_OUTPUT_CONDITIONALS + 1];

	// Accum should be set to 1 if any prior or current boolean has been set to true or
	signal accum[N_OUTPUT_CONDITIONALS];

	bool_inps[0] ==> bool_outs[0];	
	accum[0] <== bool_inps[0];

	for (var i = 1; i < N_OUTPUT_CONDITIONALS; i++) {
		// Set to bool_inps iff no true boolean has been seen in the prior stage
		bool_outs[i] <== (1 - accum[i - 1]) * bool_inps[i]; 
		accum[i] <== accum[i - 1] + bool_inps[i] - accum[i - 1] * bool_inps[i]; // An or operation
	}
	bool_outs[N_OUTPUT_CONDITIONALS] <== 1 - accum[N_OUTPUT_CONDITIONALS - 1]; // Set to 1 if accum is 0
}

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


	quotient <-- inp[0] \ inp[1];
	remainder <-- inp[0] % inp[1];
	
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

template ConditionalBuffer() {
	signal input cond_sel;
	signal input a;
	signal input b;
	signal output out;

 	component and = AND();
	a ==> and.a;
	b ==> and.b;
 	component or = OR();
	a ==> or.a;
	b ==> or.b;
	// signal input
	component mux = Mux1();
	and.out ==> mux.c[0];
	or.out ==> mux.c[1];
	cond_sel ==> mux.s;
	mux.out ==> out;
}

template ConditionalBuffers(N_SIGNLE_CLAUSE_CONDITIONALS, CONDITIONAL_BUFFER_SIZE) {
	signal input conditionals[N_SIGNLE_CLAUSE_CONDITIONALS];	
	signal input inp_sels[CONDITIONAL_BUFFER_SIZE][2];
	// 0 or 1, 0 for AND, 1 for OR
	signal input type_sel[CONDITIONAL_BUFFER_SIZE];

	signal output out[CONDITIONAL_BUFFER_SIZE];

	component cond_buffer_muxes[CONDITIONAL_BUFFER_SIZE][2];
	component cond_buffer[CONDITIONAL_BUFFER_SIZE];

	for (var i = 0; i < CONDITIONAL_BUFFER_SIZE; i++) {
		for (var a = 0; a < 2; a++) {
			cond_buffer_muxes[i][a] = Multiplexer(1, N_SIGNLE_CLAUSE_CONDITIONALS + i);
			for (var x = 0; x < N_SIGNLE_CLAUSE_CONDITIONALS; x++)
				conditionals[x] ==> cond_buffer_muxes[i][a].inp[x][0];
			for (var j = 0; j < i; j++)
				out[j] ==> cond_buffer_muxes[i][a].inp[N_SIGNLE_CLAUSE_CONDITIONALS + j][0];
		 	inp_sels[i][a] ==> cond_buffer_muxes[i][a].sel;
		}
		cond_buffer[i] = ConditionalBuffer();
		cond_buffer_muxes[i][0].out[0] ==> cond_buffer[i].a;
		cond_buffer_muxes[i][1].out[0] ==> cond_buffer[i].b;
		type_sel[i] ==> cond_buffer[i].cond_sel;
		cond_buffer[i].out ==> out[i];
	}
}

template ConditionalsToOutput(N_SIGNLE_CLAUSE_CONDITIONALS, CONDITIONAL_BUFFER_SIZE, N_OUTPUT_CONDITIONALS) {
	signal input single_clause[N_SIGNLE_CLAUSE_CONDITIONALS];
	signal input buffer_out[CONDITIONAL_BUFFER_SIZE];
	signal input next_state[N_OUTPUT_CONDITIONALS + 1];
	signal input selecting_conditionals[N_OUTPUT_CONDITIONALS];

	signal output selected_next;

	component selecting_mux[N_OUTPUT_CONDITIONALS];
	component first_true = FirstTrue(N_OUTPUT_CONDITIONALS);

	for (var i = 0; i < N_OUTPUT_CONDITIONALS; i++) {
		selecting_mux[i] = Multiplexer(1, N_SIGNLE_CLAUSE_CONDITIONALS + CONDITIONAL_BUFFER_SIZE + 2);
		for (var j = 0; j < N_SIGNLE_CLAUSE_CONDITIONALS; j++) {
			single_clause[j] ==> selecting_mux[i].inp[j][0];
		}
		for (var j = 0; j < CONDITIONAL_BUFFER_SIZE; j++) {
			buffer_out[j] ==> selecting_mux[i].inp[N_SIGNLE_CLAUSE_CONDITIONALS + j][0];
		}
		// Set default signals, true and false
		1 ==> selecting_mux[i].inp[N_SIGNLE_CLAUSE_CONDITIONALS + CONDITIONAL_BUFFER_SIZE][0];
		0 ==> selecting_mux[i].inp[N_SIGNLE_CLAUSE_CONDITIONALS + CONDITIONAL_BUFFER_SIZE + 1][0];
		selecting_conditionals[i] ==> selecting_mux[i].sel;

	 	selecting_mux[i].out[0] ==> first_true.bool_inps[i];
	}


	// Accumulate over the output. Because the output conditionals are 1 hot, we always add 0 * next_state[i]
	// except for when `i` matches to the first true conditional
	signal next_state_accum[N_OUTPUT_CONDITIONALS + 1];
	next_state_accum[0] <== first_true.bool_outs[0] * next_state[0];
	for (var i = 1; i <= N_OUTPUT_CONDITIONALS; i++) {
		next_state_accum[i] <== next_state_accum[i - 1] + first_true.bool_outs[i] * next_state[i];
	}
	selected_next <== next_state_accum[N_OUTPUT_CONDITIONALS];
}

template Buffer(WORD_SIZE) {
	signal input inps[3];
	signal output out;
	signal input mux_sel[2];

	component abs_num = Abs(WORD_SIZE);
	component abs_denom = Abs(WORD_SIZE);
	component divide_mod = IntegerDivideRemainder(WORD_SIZE);
	component mux = Mux2();

	inps[0] ==> abs_num.inp;
	inps[1] ==> abs_denom.inp;

	// The XOR of numerator and divisor sign
	signal quotient_is_neg;
	quotient_is_neg <== abs_denom.is_neg + abs_num.is_neg - 2 * abs_denom.is_neg * abs_num.is_neg;

	abs_num.out ==> divide_mod.inp[0];
	abs_denom.out ==> divide_mod.inp[1];

	mux_sel[0] ==> mux.s[0];
	mux_sel[1] ==> mux.s[1];

	mux.c[0] <== inps[0] * inps[1] + inps[2];
	mux.c[1] <== abs_num.out;
	mux.c[2] <== divide_mod.quotient * (1 - 2 * quotient_is_neg);
	// Note that we do not support positive or negatives with the % operation
	// I.e. for a, b, we calculate |a| % |b|
	mux.c[3] <== divide_mod.remainder;

	mux.out ==> out;

}

// Lets add more func to the buffers now...
template Buffers(INPUT_BUFFER_SIZE, INPUT_SIZE, WORD_SIZE) {
	signal input inp[INPUT_SIZE];
	signal input buffer_inp_mux_sel[INPUT_BUFFER_SIZE][3];
	signal input buffer_type_sel[INPUT_BUFFER_SIZE][2];

	signal output out[INPUT_BUFFER_SIZE];
	component buffer_inp_muxes[INPUT_BUFFER_SIZE][3];
	component muxs_out = Mux2(); // Should be mux2s
	component buffers[INPUT_BUFFER_SIZE];

	for (var i = 0; i < INPUT_BUFFER_SIZE; i++) {
		buffers[i] = Buffer(WORD_SIZE);
		for (var j = 0; j < 3; j++) {
			buffer_inp_muxes[i][j] = Multiplexer(1, INPUT_SIZE + i);
			for (var x = 0; x < INPUT_SIZE; x++) {
				inp[x] ==> buffer_inp_muxes[i][j].inp[x][0];
			}
			for (var x = 0; x < i; x++) {
				out[x] ==> buffer_inp_muxes[i][j].inp[INPUT_SIZE + x][0];
			}
			buffer_inp_mux_sel[i][j] ==> buffer_inp_muxes[i][j].sel;
			buffer_inp_muxes[i][j].out[0] ==> buffers[i].inps[j];
		}
		buffer_type_sel[i][0] ==> buffers[i].mux_sel[0];
		buffer_type_sel[i][1] ==> buffers[i].mux_sel[1];
		buffers[i].out ==> out[i];
	}
}

template FD_Emulator(
	INPUT_BUFFER_SIZE,
	CONDITIONAL_BUFFER_SIZE,
	INPUT_SIZE,
	N_SIGNLE_CLAUSE_CONDITIONALS,
	N_OUTPUT_CONDITIONALS,
	N_WORD_BITS
) {  
	// We require the WORD_SIZE to be less than 1/2 of the the bit size of |p| so that we
	// can get away with integer division on the raw numbers
	// I.e. for a // b = q and a % b = c,
	// integer division can easily be verified by checking that b * q + c = a, 0 <= c < b, 0 < q < a
	// Note that we require b * q < p as to not overflow/ wrap around the modulus. Thus, if 2 * word sizes + 1
	// is less than the word size of p, (q * b + a) < p and no overflowing occurs
	assert(N_WORD_BITS < 119);

	// The number of conditionals + 1 for a default
	signal input next_state[N_OUTPUT_CONDITIONALS + 1];

	signal input conditionals_to_state_selectors[N_OUTPUT_CONDITIONALS];

	signal input inputs[INPUT_SIZE];

	// Range over 0-2 to select from eq, lt, and lte
	signal input conditional_mux_sel[N_SIGNLE_CLAUSE_CONDITIONALS][2];
	
	// Range over inputs and buffer inputs for the inputs into conditionals
	signal input conditional_inputs_mux_sel[N_SIGNLE_CLAUSE_CONDITIONALS][2];

	// Range over selectors for the inputs and buffers with smaller indices so we can chain things
	signal input buffer_mux_sel[INPUT_BUFFER_SIZE][3];
	signal input buffer_type_sel[INPUT_BUFFER_SIZE][2];

	// Range over selectors for the inputs and buffers with smaller indices so we can chain things
	signal input cond_buffer_mux_sel[CONDITIONAL_BUFFER_SIZE][2];
	signal input cond_buffer_type_sel[CONDITIONAL_BUFFER_SIZE];

  signal output selected_next;

	component buffers = Buffers(INPUT_BUFFER_SIZE, INPUT_SIZE, N_WORD_BITS);
	for (var i = 0; i < INPUT_SIZE; i++) {
		inputs[i] ==> buffers.inp[i];
	}
	for(var i = 0; i < INPUT_BUFFER_SIZE; i++) {
		buffer_mux_sel[i][0] ==> buffers.buffer_inp_mux_sel[i][0];
		buffer_mux_sel[i][1] ==> buffers.buffer_inp_mux_sel[i][1];
		buffer_mux_sel[i][2] ==> buffers.buffer_inp_mux_sel[i][2];
		buffer_type_sel[i][0] ==> buffers.buffer_type_sel[i][0];
		buffer_type_sel[i][1] ==> buffers.buffer_type_sel[i][1];
	}

	// Now check the conditions
	component conditional_muxes_inputs[N_SIGNLE_CLAUSE_CONDITIONALS][2];
	component conditionals[N_SIGNLE_CLAUSE_CONDITIONALS];
	for (var i = 0; i < N_SIGNLE_CLAUSE_CONDITIONALS; i++) {
		conditionals[i] = MuxedComparator(N_WORD_BITS);
		conditional_muxes_inputs[i][0] = InputAndBufferMux(INPUT_SIZE, INPUT_BUFFER_SIZE);
		conditional_muxes_inputs[i][1] = InputAndBufferMux(INPUT_SIZE, INPUT_BUFFER_SIZE);
		for (var x = 0; x < INPUT_SIZE; x++) {
			inputs[x] ==> conditional_muxes_inputs[i][0].inputs[x];
			inputs[x] ==> conditional_muxes_inputs[i][1].inputs[x];
		}
		
		for (var x = 0; x < INPUT_BUFFER_SIZE; x++) {
			buffers.out[x] ==> conditional_muxes_inputs[i][0].buffers[x];
			buffers.out[x] ==> conditional_muxes_inputs[i][1].buffers[x];
		}

		conditional_inputs_mux_sel[i][0] ==> conditional_muxes_inputs[i][0].sel;
		conditional_inputs_mux_sel[i][1] ==> conditional_muxes_inputs[i][1].sel;

		conditional_muxes_inputs[i][0].out ==> conditionals[i].inp[0];
		conditional_muxes_inputs[i][1].out ==> conditionals[i].inp[1];

		conditional_mux_sel[i][0] ==> conditionals[i].sel[0];
		conditional_mux_sel[i][1] ==> conditionals[i].sel[1];
	}

  component cond_buffers = ConditionalBuffers(N_SIGNLE_CLAUSE_CONDITIONALS, CONDITIONAL_BUFFER_SIZE);
  for (var i = 0; i < N_SIGNLE_CLAUSE_CONDITIONALS; i++)
  	conditionals[i].out ==> cond_buffers.conditionals[i];
  for (var i = 0; i < CONDITIONAL_BUFFER_SIZE; i++) {
	  cond_buffer_mux_sel[i][0] ==> cond_buffers.inp_sels[i][0];
	  cond_buffer_mux_sel[i][1] ==> cond_buffers.inp_sels[i][1];
	  cond_buffer_type_sel[i] ==> cond_buffers.type_sel[i];
  }
  component conds_to_out = ConditionalsToOutput(N_SIGNLE_CLAUSE_CONDITIONALS, CONDITIONAL_BUFFER_SIZE, N_OUTPUT_CONDITIONALS);
  for (var i = 0; i < N_SIGNLE_CLAUSE_CONDITIONALS; i++)
		conditionals[i].out ==> conds_to_out.single_clause[i];
  for (var i = 0; i < CONDITIONAL_BUFFER_SIZE; i++)
		cond_buffers.out[i] ==> conds_to_out.buffer_out[i];
  for (var i = 0; i < N_OUTPUT_CONDITIONALS; i++) {
		conditionals_to_state_selectors[i] ==> conds_to_out.selecting_conditionals[i];
		next_state[i] ==> conds_to_out.next_state[i];
	}
	next_state[N_OUTPUT_CONDITIONALS] ==> conds_to_out.next_state[N_OUTPUT_CONDITIONALS];
	conds_to_out.selected_next ==> selected_next;
}