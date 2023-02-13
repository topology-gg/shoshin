pragma circom 2.0.0;

include "multiplexer.circom"
include "mux2.circom"
include "comparators.circom"

/*This circuit template checks that c is the multiplication of a and b.*/  

// TODO: MAX STACK SIZE same as prog max steps? (because ops never increase size of stack)
template FD_VM (PROG_MAX_STEPS, BUFFER_SIZE, INP_PROG_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS) {  
	signal input next_minds[N_CONDITIONALS];
	signal input next_intents[N_CONDITIONALS];

	// Range over 0-2 to select from eq, lt, and lte
	signal input conditional_mux_sel[N_CONDITIONALS];
	
	// Range over inputs and buffer inputs for the inputs into conditionals
	signal input conditional_inputs_mux_sel[N_CONDITIONALS][2];

	// Range over selectors for the inputs and buffers with smaller indices so we can chain things
	// TODO: for generality we have another layer of muxing... :(
	signal input buffer_mux_sel[BUFFER_SIZE][3];

  signal output selected_next_mind;
  signal output selected_next_intent;

	component buffer_muxes[BUFFER_SIZE][3] = Multiplexer(1, INPUT_SIZE);
	component conditional_muxes[N_CONDITIONALS] = Mux2();

	component comps_eq[N_CONDITIONALS] = IsEqual();
	component comps_lt[N_CONDITIONALS] = LessThan(N_WORD_BITS);
	component comps_lte[N_CONDITIONALS] = LessEqThan(N_WORD_BITS);

	var buffer[BUFFER_SIZE];
	var conditional_bools[N_CONDITIONALS];

	// TODO: set up buffer multiplexer for the 0th and signal for 0th
	
	// First populate the buffer
	for (var i = 1; i < BUFFER_SIZE; i++) {
		// TODO: setup the buffer mux

		buffer[i] = buffer_muxes[i][0].out * buffer_muxes[i][1].out + buffer_muxes[i][2].out;
	}

	for (var i = 0; i < N_CONDITIONALS; i++) {
		// TODO: setup up each conditiona
		conditional_bools[i] = conditional_muxes[i].out;
	}
}