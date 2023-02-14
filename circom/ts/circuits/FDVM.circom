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

	signal buffer[BUFFER_SIZE];

	// First populate the buffer
	for (var i = 0; i < BUFFER_SIZE; i++) {
		// TODO: setup the buffer mux
		for (var x = 0; x < INPUT_SIZE; x++) {
			inputs[x] ==> buffer_muxes[i][0].inp[x][0];
			inputs[x] ==> buffer_muxes[i][1].inp[x][0];
			inputs[x] ==> buffer_muxes[i][2].inp[x][0];
		}
		for (var j = 0; j < i; j++) {
			buffer[j] ==> buffer_muxes[i][0].inp[INPUT_SIZE + j][0];
			buffer[j] ==> buffer_muxes[i][1].inp[INPUT_SIZE + j][0];
			buffer[j] ==> buffer_muxes[i][2].inp[INPUT_SIZE + j][0];
		}

		buffer_mux_sel[i][0] ==> buffer_muxes[i][0].sel;
		buffer_mux_sel[i][1] ==> buffer_muxes[i][1].sel;
		buffer_mux_sel[i][2] ==> buffer_muxes[i][2].sel;

		buffer[i] <== buffer_muxes[i][0].out[0] * buffer_muxes[i][1].out[0] + buffer_muxes[i][2].out[0];
	}

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
			buffer[x] ==> conditional_muxes_inputs[i][0].buffers[x];
			buffer[x] ==> conditional_muxes_inputs[i][1].buffers[x];
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