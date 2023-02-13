pragma circom 2.0.0;

include "multiplexer.circom"
include "mux2.circom"
include "comparators.circom"

/* A simple wrapper to mux between to arrays, inputs and buffers */
template InputAndBufferMux(INPUT_SIZE, BUFFER_SIZE) {
	component mux = Multiplexer(1, INPUT_SIZE + BUFFER_SIZE);
	signal input inputs[INPUT_SIZE];
	signal input buffers[BUFFER_SIZE];
	signal input sel;
	signal output out;

	component mux = Multiplexer(1, INPUT_SIZE + BUFFER_SIZE);
	for (var i = 0; i < INPUT_SIZE; i++) {
		inputs[i] ==> mux.inp[i][0];
	}
	for (var i = 0; i < BUFFER_SIZE; i++) {
		buffers[i] ==> mux.inp[INPUT_SIZE + i][0];
	}
	sel ==> mux.sel;
	mux.out ==> out;
}

// TODO: MAX STACK SIZE same as prog max steps? (because ops never increase size of stack)
template FD_VM (PROG_MAX_STEPS, BUFFER_SIZE, INP_PROG_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS) {  
	signal input next_minds[N_CONDITIONALS];
	signal input next_intents[N_CONDITIONALS];
	signal inputs[INPUT_SIZE];

	// Range over 0-2 to select from eq, lt, and lte
	signal input conditional_mux_sel[N_CONDITIONALS];
	
	// Range over inputs and buffer inputs for the inputs into conditionals
	signal input conditional_inputs_mux_sel[N_CONDITIONALS][2];

	// Range over selectors for the inputs and buffers with smaller indices so we can chain things
	// TODO: for generality we have another layer of muxing... :(
	signal input buffer_mux_sel[BUFFER_SIZE][3];

  signal output selected_next_mind;
  signal output selected_next_intent;

	component buffer_muxes[BUFFER_SIZE][3];
	for (var i = 0; i < BUFFER_SIZE; i++) {
		// Give buffers access to prior inputs
		buffer_muxes[i][0] = Multiplexer(1, INPUT_SIZE + i);
		buffer_muxes[i][1] = Multiplexer(1, INPUT_SIZE + i);
		buffer_muxes[i][2] = Multiplexer(1, INPUT_SIZE + i);
	}

	component conditional_muxes_inputs[N_CONDITIONALS][2] = Multiplexer(1, INPUT_SIZE + BUFFER_SIZE);;
	component conditional_muxes[N_CONDITIONALS] = Mux2();

	component comps_eq[N_CONDITIONALS] = IsEqual();
	component comps_lt[N_CONDITIONALS] = LessThan(N_WORD_BITS);
	component comps_lte[N_CONDITIONALS] = LessEqThan(N_WORD_BITS);

	var buffer[BUFFER_SIZE];
	var conditional_bools[N_CONDITIONALS];

	// TODO: set up buffer multiplexer for the 0th and signal for 0th
	inputs ==> buffer_muxes[0][0].inp;
	inputs ==> buffer_muxes[0][1].inp;
	inputs ==> buffer_muxes[0][2].inp;
	buffer_mux_sel[0][0] ==> buffer_muxes[0][0].sel;
	buffer_mux_sel[0][1] ==> buffer_muxes[0][1].sel;
	buffer_mux_sel[0][2] ==> buffer_muxes[0][2].sel;

	buffer[0] = buffer_muxes[0][0].out * buffer_muxes[0][1].out + buffer_muxes[0][2].out;
	
	// First populate the buffer
	for (var i = 1; i < BUFFER_SIZE; i++) {
		// TODO: setup the buffer mux
		for (var x = 0; x < INPUT_SIZE; x++) {
			inputs[x] ==> buffer_muxes[i][0].inp[x];
			inputs[x] ==> buffer_muxes[i][1].inp[x];
			inputs[x] ==> buffer_muxes[i][2].inp[x];
		}
		for (var j = 0; j < i; j++) {
			inputs[INPUT_SIZE + j] ==> buffer_muxes[i][0].inp[INPUT_SIZE + j];
			inputs[INPUT_SIZE + j] ==> buffer_muxes[i][1].inp[INPUT_SIZE + j];
			inputs[INPUT_SIZE + j] ==> buffer_muxes[i][2].inp[INPUT_SIZE + j];
		}

		buffer_mux_sel[i][0] ==> buffer_muxes[0][0].sel;
		buffer_mux_sel[i][1] ==> buffer_muxes[0][1].sel;
		buffer_mux_sel[i][2] ==> buffer_muxes[0][2].sel;

		buffer[i] = buffer_muxes[i][0].out * buffer_muxes[i][1].out + buffer_muxes[i][2].out;
	}

	for (var i = 0; i < N_CONDITIONALS; i++) {
		
		conditional_bools[i] = conditional_muxes[i].out;
	}
}