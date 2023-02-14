pragma circom 2.0.0;

include "../circomlib/circuits/multiplexer.circom";
include "../circomlib/circuits/mux2.circom";
include "../circomlib/circuits/comparators.circom";

/* A simple wrapper to mux between to arrays, inputs and buffers */
template InputAndBufferMux(INPUT_SIZE, BUFFER_SIZE) {
	component mux = Multiplexer(1, INPUT_SIZE + BUFFER_SIZE);
	signal input inputs[INPUT_SIZE];
	signal input buffers[BUFFER_SIZE];
	signal input sel;
	signal output out;

	for (var i = 0; i < INPUT_SIZE; i++) {
		inputs[i] ==> mux.inp[i][0];
	}
	for (var i = 0; i < BUFFER_SIZE; i++) {
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
	component lt = LessThan(N_WORD_BITS); // TODO: SPECIFIY MAX BIT SIZE!!!
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
template FirstTrue(N_CONDITIONALS) {
	signal input bool_inps[N_CONDITIONALS];
	signal output bool_outs[N_CONDITIONALS];

	// Accum should be set to 1 if any prior or current boolean has been set to true or
	signal accum[N_CONDITIONALS];

	bool_inps[0] ==> bool_outs[0];	
	accum[0] <== bool_inps[0];

	for (var i = 1; i < N_CONDITIONALS; i++) {
		// Set to bool_inps iff no true boolean has been seen in the prior stage
		bool_outs[i] <== (1 - accum[i - 1]) * bool_inps[i]; 
		accum[i] <== accum[i - 1] + bool_inps[i] - accum[i - 1] * bool_inps[i]; // An or operation
	}
}

template Abs(WORD_SIZE) {
	component lt = LessThan(WORD_SIZE);
	signal input inp;
	signal output out;
	inp ==> lt.in[0];
	0 ==> lt.in[1];
	out <== (1 - lt.out * 2) * inp;
}

template IntegerDivideRemainder(WORD_SIZE) {
	// TODO: assert(n <= ___blah___)
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

	// TODO: HARD BAKE SIZE REQUIREMENT OF WORD SIZE (being less than half max number of bits)
}

template Buffer(WORD_SIZE) {
	signal input inps[3];
	signal output out;
	signal input mux_sel[2];

	component abs = Abs(WORD_SIZE);
	component divide_mod = IntegerDivideRemainder(WORD_SIZE);
	component mux = Mux2();

	inps[0] ==> abs.inp;

	inps[0] ==> divide_mod.inp[0];
	inps[1] ==> divide_mod.inp[1];

	mux_sel[0] ==> mux.s[0];
	mux_sel[1] ==> mux.s[1];

	mux.c[0] <== inps[0] * inps[1] + inps[2];
	mux.c[1] <== abs.out;
	mux.c[2] <== divide_mod.quotient;
	mux.c[3] <== divide_mod.remainder;

	mux.out ==> out;

}

// Lets add more func to the buffers now...
template Buffers(BUFFER_SIZE, INPUT_SIZE, WORD_SIZE) {
	signal input inp[INPUT_SIZE];
	signal input buffer_inp_mux_sel[BUFFER_SIZE][3];
	signal input buffer_type_sel[BUFFER_SIZE][2];

	signal output out[BUFFER_SIZE];
	component buffer_inp_muxes[BUFFER_SIZE][3]; // We either allow for quad constraint of %, abs, /
	component muxs_out = Mux2(); // Should be mux2s
	component buffers[BUFFER_SIZE];

	for (var i = 0; i < BUFFER_SIZE; i++) {
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

template FD_VM (BUFFER_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS) {  
	// TODO: think about splitting up next state and next intent... for now just keep it simple with one next function...
	signal input next_state[N_CONDITIONALS];

	signal input inputs[INPUT_SIZE];

	// Range over 0-2 to select from eq, lt, and lte
	signal input conditional_mux_sel[N_CONDITIONALS][2];
	
	// Range over inputs and buffer inputs for the inputs into conditionals
	signal input conditional_inputs_mux_sel[N_CONDITIONALS][2];

	// Range over selectors for the inputs and buffers with smaller indices so we can chain things
	// TODO: for generality we have another layer of muxing... :(
	signal input buffer_mux_sel[BUFFER_SIZE][3];
	signal input buffer_type_sel[BUFFER_SIZE][2];

  signal output selected_next;

	component buffer_muxes[BUFFER_SIZE][3];
	for (var i = 0; i < BUFFER_SIZE; i++) {
		// Give buffers access to prior inputs
		buffer_muxes[i][0] = Multiplexer(1, INPUT_SIZE + i);
		buffer_muxes[i][1] = Multiplexer(1, INPUT_SIZE + i);
		buffer_muxes[i][2] = Multiplexer(1, INPUT_SIZE + i);
	}

	component conditional_muxes_inputs[N_CONDITIONALS][2];
	component conditionals[N_CONDITIONALS];
	component first_true = FirstTrue(N_CONDITIONALS);

	component buffers = Buffers(BUFFER_SIZE, INPUT_SIZE, N_WORD_BITS);
	for (var i = 0; i < INPUT_SIZE; i++) {
		inputs[i] ==> buffers.inp[i];
	}
	for(var i = 0; i < BUFFER_SIZE; i++) {
		buffer_mux_sel[i][0] ==> buffers.buffer_inp_mux_sel[i][0];
		buffer_mux_sel[i][1] ==> buffers.buffer_inp_mux_sel[i][1];
		buffer_mux_sel[i][2] ==> buffers.buffer_inp_mux_sel[i][2];
		buffer_type_sel[i][0] ==> buffers.buffer_type_sel[i][0];
		buffer_type_sel[i][1] ==> buffers.buffer_type_sel[i][1];
	}


// //  TODO: clean up with new component
// 	// First populate the buffer
// 	for (var i = 0; i < BUFFER_SIZE; i++) {
// 		for (var x = 0; x < INPUT_SIZE; x++) {
// 			inputs[x] ==> buffer_muxes[i][0].inp[x][0];
// 			inputs[x] ==> buffer_muxes[i][1].inp[x][0];
// 			inputs[x] ==> buffer_muxes[i][2].inp[x][0];
// 		}
// 		for (var j = 0; j < i; j++) {
// 			buffer[j] ==> buffer_muxes[i][0].inp[INPUT_SIZE + j][0];
// 			buffer[j] ==> buffer_muxes[i][1].inp[INPUT_SIZE + j][0];
// 			buffer[j] ==> buffer_muxes[i][2].inp[INPUT_SIZE + j][0];
// 		}

// 		buffer_mux_sel[i][0] ==> buffer_muxes[i][0].sel;
// 		buffer_mux_sel[i][1] ==> buffer_muxes[i][1].sel;
// 		buffer_mux_sel[i][2] ==> buffer_muxes[i][2].sel;

// 		buffer[i] <== buffer_muxes[i][0].out[0] * buffer_muxes[i][1].out[0] + buffer_muxes[i][2].out[0];
// 	}

	signal next_state_accum[N_CONDITIONALS];

	// Now check the conditions
	for (var i = 0; i < N_CONDITIONALS; i++) {
		conditionals[i] = MuxedComparator(N_WORD_BITS);
		conditional_muxes_inputs[i][0] = InputAndBufferMux(INPUT_SIZE, BUFFER_SIZE);
		conditional_muxes_inputs[i][1] = InputAndBufferMux(INPUT_SIZE, BUFFER_SIZE);
		for (var x = 0; x < INPUT_SIZE; x++) {
			inputs[x] ==> conditional_muxes_inputs[i][0].inputs[x];
			inputs[x] ==> conditional_muxes_inputs[i][1].inputs[x];
		}
		
		for (var x = 0; x < BUFFER_SIZE; x++) {
			buffers.out[x] ==> conditional_muxes_inputs[i][0].buffers[x];
			buffers.out[x] ==> conditional_muxes_inputs[i][1].buffers[x];
		}

		conditional_inputs_mux_sel[i][0] ==> conditional_muxes_inputs[i][0].sel;
		conditional_inputs_mux_sel[i][1] ==> conditional_muxes_inputs[i][1].sel;

		conditional_muxes_inputs[i][0].out ==> conditionals[i].inp[0];
		conditional_muxes_inputs[i][1].out ==> conditionals[i].inp[1];

		conditional_mux_sel[i][0] ==> conditionals[i].sel[0];
		conditional_mux_sel[i][1] ==> conditionals[i].sel[1];

	 	conditionals[i].out ==> first_true.bool_inps[i];
	}

	next_state_accum[0] <== first_true.bool_outs[0] * next_state[0];
	for (var i = 1; i < N_CONDITIONALS; i++) {
		next_state_accum[i] <== next_state_accum[i - 1] + first_true.bool_outs[i] * next_state[i];
	}
	// TODO: allow for defaults???
	selected_next <== next_state_accum[N_CONDITIONALS - 1];
}