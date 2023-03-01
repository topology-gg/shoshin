pragma circom 2.0.0;

include "./FDEmulator.circom";
include "../circomlib/circuits/comparators.circom";
include "../circomlib/circuits/poseidon.circom";
include "../circomlib/circuits/smt/smtverifier.circom";

template Commitment_Check() {
	signal input elem;
	signal input randomness;
	signal input comm;
	signal output out;
	component hasher = Poseidon(2);

	hasher[0] <== elem;
	hasher[1] <== randomness;

	component check_eq = IsZero();
	check_eq.in <== hasher.out - comm;
	check_eq.out ==> out;
}

template FD_Merkle_Tree(MT_N_LEVELS) {
	signal input elem;
	signal input root;
	signal input siblings[MT_N_LEVELS];
	// Determines if the siblings are on the left or right, 0 for left and 1 for right
	signal input sibling_positions[MT_N_LEVELS];

	// Set to 1 if the merkle tree contains the element and 0 otherwise
	signal output out;
	component hashers[MT_N_LEVELS];

	hashers[0] = Poseidon(2);
	// TODO: check
	hashers[0][0] <== (elem - siblings[0])*sibling_positions[0] + siblings[0];
	hashers[0][1] <== (siblings[0] - elem)*sibling_positions[0] + elem;
	sibling_positions[i] * 

	for (var i = 1; i < MT_N_LEVELS; i++) {
		hashers[i] = Poseidon(2);
		hashers[i][0] <== (hashers[i-1].out - siblings[i])*sibling_positions[i] + siblings[i];
		hashers[i][1] <== (siblings[i] - hashers[i-1].out)*sibling_positions[i] + hashers[i-1].out;
	}
	component check_eq = IsZero();
	check_eq.in <== hashers[MT_N_LEVELS - 1].out - root;
	check_eq.out ==> out;
}

template FD_Hasher(CONSTANTS_SIZE, N_TRACES) {
	signal input mind;
	signal input constants[CONSTANTS_SIZE];
	signal input trace_inp_sels[N_TRACES][2];
	signal input trace_type_sel[N_TRACES];
	signal output out;

	component hasher = Poseidon(CONSTANTS_SIZE + N_TRACES * 3 + 1);

	for (var i = 0; i < CONSTANTS_SIZE; i++) {
		constants[i] ==> hasher.inputs[i];
	}
	for (var i = 0; i < N_TRACES; i++) {
		trace_type_sel[i] ==> hasher.inputs[CONSTANTS_SIZE + 3 * i];
		trace_inp_sels[i][0] ==> hasher.inputs[CONSTANTS_SIZE + 3 * i + 1];
		trace_inp_sels[i][1] ==> hasher.inputs[CONSTANTS_SIZE + 3 * i + 2];
	}
	mind ==> hasher.inputs[CONSTANTS_SIZE + N_TRACES * 3];

	hasher.out ==> out;

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

	signal public input current_mind_comm;
	signal input current_mind_randomness;
	signal input current_mind;

	signal input next_state_randomness;
	signal input next_state_comm;

	// signal input fd_inputs[INPUT_SIZE];
	signal input public input_dict[DICT_SIZE];
	signal input input_constant[CONSTANTS_SIZE];
	signal input fd_trace_inp_selectors[N_TRACES][2];
	signal input fd_trace_type_selectors[N_TRACES];

	// signal input out;
	component fd_emulator = FD_Emulator(DICT_SIZE + CONSTANTS_SIZE, N_TRACES, WORD_SIZE);
	// TODO: setup above

	// Merkle Tree Inputs
	signal input public mt_root;
	signal input mt_siblings[MT_N_LEVELS];
	signal input mt_sibling_positions[MT_N_LEVELS];

	/***************** Setup FD_Hasher *******************/
	component fd_hasher = FD_Hasher(CONSTANTS_SIZE, N_TRACES);
	for (var i = 0; i < CONSTANTS_SIZE; i++) input_constant[i] ==> fd_hasher.constants[i];
	for (var i = 0; i < N_TRACES; i++) {
		fd_trace_inp_selectors[i][0] ==> fd_hasher.trace_inp_sels[i][0];
		fd_trace_inp_selectors[i][1] ==> fd_hasher.trace_inp_sels[i][1];
		fd_trace_type_selectors[i] ==> fd_hasher.trace_type_sel[i];
	}
	current_mind ==> fd_hasher.mind;
	/***************** End Setup FD_Hasher *******************/
	
	/***************** Check that the SMT holds up **************/
	component mt_verif =  FD_Merkle_Tree(SMT_N_LEVELS);

	fd_hasher.out ==> mt_verif.elem;
	mt_root ==> mt_verif.root;
	for (var i = 0; i < MT_N_LEVELS; i++) {
		mt_siblings ==> mt_verif.siblings[i];
		mt_sibling_positions ==> mt_verif.sibling_positions[i];
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

}
