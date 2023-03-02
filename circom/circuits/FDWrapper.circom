pragma circom 2.0.0;

include "./FDEmulator.circom";
include "../circomlib/circuits/comparators.circom";
include "../circomlib/circuits/mimc.circom";
include "../circomlib/circuits/poseidon.circom";
include "../circomlib/circuits/pedersen.circom";
include "../circomlib/circuits/smt/smtverifier.circom";

template Commitment_Check() {
	signal input elem;
	signal input randomness;
	signal input comm;
	signal output out;
	component hasher = Poseidon(2);

	hasher.inputs[0] <== elem;
	hasher.inputs[1] <== randomness;

	component check_eq = IsZero();
	check_eq.in <== hasher.out - comm;
	check_eq.out ==> out;
}

template FD_Merkle_Tree(MT_N_LEVELS) {
	signal input elem;
	signal input root;
	signal input siblings[MT_N_LEVELS - 1];
	// Determines if the siblings are on the left or right, 0 for left and 1 for right
	signal input sibling_positions[MT_N_LEVELS - 1];

	// Set to 1 if the merkle tree contains the element and 0 otherwise
	signal output out;
	component hashers[MT_N_LEVELS - 1];

	hashers[0] = Poseidon(2);

	// Select between left and right inputs depending on the position
	hashers[0].inputs[0] <== (elem - siblings[0]) * sibling_positions[0] + siblings[0];
	hashers[0].inputs[1] <== (siblings[0] - elem) * sibling_positions[0] + elem;

	for (var i = 1; i < MT_N_LEVELS - 1; i++) {
		hashers[i] = Poseidon(2);
		hashers[i].inputs[0] <== (hashers[i-1].out - siblings[i])*sibling_positions[i] + siblings[i];
		hashers[i].inputs[1] <== (siblings[i] - hashers[i-1].out)*sibling_positions[i] + hashers[i-1].out;
	}
	component check_eq = IsZero();
	check_eq.in <== hashers[MT_N_LEVELS - 2].out - root;
	check_eq.out ==> out;
}

template FD_Hasher(CONSTANTS_SIZE, N_TRACES) {
	var n_inps = CONSTANTS_SIZE + N_TRACES * 3 + 2;

	signal input mind;
	signal input constants[CONSTANTS_SIZE];
	signal input trace_inp_sels[N_TRACES][2];
	signal input trace_type_sel[N_TRACES];
	signal input randomness;
	signal output out;

	// 91 mimc rounds as per Circomlibjs:
	// See, https://github.com/iden3/circomlibjs/blob/main/src/mimc7.js
	component mimc = MultiMiMC7(n_inps, 91);
	mimc.k <== 0;

	for (var i = 0; i < CONSTANTS_SIZE; i++) {
		constants[i] ==> mimc.in[i];
	}
	for (var i = 0; i < N_TRACES * 3; i += 3) {
		trace_type_sel[i \ 3] ==> mimc.in[i + CONSTANTS_SIZE];
		trace_inp_sels[i \ 3][0] ==> mimc.in[i + CONSTANTS_SIZE + 1];
		trace_inp_sels[i \ 3][1] ==> mimc.in[i + CONSTANTS_SIZE + 2];
	}
	var mind_idx = CONSTANTS_SIZE + N_TRACES * 3;
	mind ==> mimc.in[mind_idx];
	var rand_idx = CONSTANTS_SIZE + N_TRACES * 3 + 1;
	randomness ==> mimc.in[rand_idx];

	mimc.out ==> out;
}

template FD_Wrapper(
	DICT_SIZE,
	CONSTANTS_SIZE,
	N_TRACES,
	WORD_SIZE,
	MT_N_LEVELS
) {  
	// We require the WORD_SIZE to be less than 1/2 of the the bit size of |p| so that we
	// can get away with integer division on the raw numbers
	// I.e. for a // b = q and a % b = c,
	// integer division can easily be verified by checking that b * q + c = a, 0 <= c < b, 0 < q < a
	// Note that we require b * q < p as to not overflow/ wrap around the modulus. Thus, if 2 * word sizes + 1
	// is less than the word size of p, (q * b + a) < p and no overflowing occurs
	assert(WORD_SIZE < 119);

	signal input current_mind_comm; // Public signal
	signal input current_mind_randomness;
	signal input current_mind;

	signal input next_state_randomness;
	signal input next_state_comm;

	signal input input_dict[DICT_SIZE]; // Public signal
	signal input input_constants[CONSTANTS_SIZE];
	signal input fd_trace_inp_selectors[N_TRACES][2];
	signal input fd_trace_type_selectors[N_TRACES];
	signal input fd_comm_randomness;

	// Merkle Tree Inputs
	signal input mt_root; // Public signal
	signal input mt_siblings[MT_N_LEVELS - 1];
	signal input mt_sibling_positions[MT_N_LEVELS - 1];

	// 1 if all checks pass, 0 otherwise
	signal output out;

	// signal input out;
	/***************** Setup the FD_Emulator *****************/
	component fd_emulator = FD_Emulator(DICT_SIZE + CONSTANTS_SIZE, N_TRACES, WORD_SIZE);
	for (var i = 0; i < CONSTANTS_SIZE; i++) {
		input_constants[i] ==> fd_emulator.inputs[i];
	}
	for (var i = 0; i < DICT_SIZE; i++) {
		input_dict[i] ==> fd_emulator.inputs[CONSTANTS_SIZE + i];
	}
	for (var i = 0; i < N_TRACES; i++) {
		fd_trace_inp_selectors[i][0] ==> fd_emulator.trace_inp_selectors[i][0];
		fd_trace_inp_selectors[i][1] ==> fd_emulator.trace_inp_selectors[i][1];
		fd_trace_type_selectors[i] ==> fd_emulator.trace_type_selectors[i];
	}

	/***************** End Setup the FD_Emulator *****************/

	/***************** Setup FD_Hasher *******************/
	component fd_hasher = FD_Hasher(CONSTANTS_SIZE, N_TRACES);
	for (var i = 0; i < CONSTANTS_SIZE; i++) input_constants[i] ==> fd_hasher.constants[i];
	for (var i = 0; i < N_TRACES; i++) {
		fd_trace_inp_selectors[i][0] ==> fd_hasher.trace_inp_sels[i][0];
		fd_trace_inp_selectors[i][1] ==> fd_hasher.trace_inp_sels[i][1];
		fd_trace_type_selectors[i] ==> fd_hasher.trace_type_sel[i];
	}
	current_mind ==> fd_hasher.mind;
	fd_comm_randomness ==> fd_hasher.randomness;
	/***************** End Setup FD_Hasher *******************/
	
	/***************** Check that the SMT holds up **************/
	component mt_verif =  FD_Merkle_Tree(MT_N_LEVELS);

	fd_hasher.out ==> mt_verif.elem;
	mt_root ==> mt_verif.root;
	for (var i = 0; i < MT_N_LEVELS - 1; i++) {
		mt_siblings[i] ==> mt_verif.siblings[i];
		mt_sibling_positions[i] ==> mt_verif.sibling_positions[i];
	}
	/***************** End check that the SMT holds up **************/

	/***************** Check that the current mind commitment holds up ********/
	component comm_current_mind = Commitment_Check();
	comm_current_mind.elem <== current_mind;
	comm_current_mind.randomness <== current_mind_randomness;
	comm_current_mind.comm <== current_mind_comm;
	/***************** End check that the mind commitment holds up ************/

	/***************** Check that the next state commitment holds up ********/
	component comm_next_state = Commitment_Check();
	comm_next_state.elem <== fd_emulator.out;
	comm_next_state.randomness <== next_state_randomness;
	comm_next_state.comm <== next_state_comm;
	/***************** End check that the next state commitment holds up ************/

	// Assert that all three conditions are met
	3 === comm_next_state.out + comm_current_mind.out + mt_verif.out;

	// out <== comm_next_state.out + comm_current_mind.out + mt_verif.out;

	component is_out_3 =  IsZero();
	is_out_3.in <== comm_next_state.out + comm_current_mind.out + mt_verif.out - 3;
	is_out_3.out ==> out;
}


// TODO:
// test the merkle tree habib seperatly
// Test the whole thing