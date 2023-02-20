pragma circom 2.0.0;

include "FDStep.circom";
include "../circomlib/circuits/poseidon.circom";

/*This circuit template checks that c is the multiplication of a and b.*/  

template PoseidonElemCommitment() {
   signal public input comm;
   signal input elem;
   signal input randomness;

   component pos = Poseidon(2);
   elem ==> pos.inputs[0];
   randomness ==> pos.inputs[1];
   comm === pos.out;
}

template FDWrapper(BUFFER_SIZE, PUBLIC_INPUT_SIZE, FD_CONST_SIZE, N_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE) {  
   // assert(PUBLIC_INPUT_SIZE <= INPUT_SIZE - 1);
   var INPUT_SIZE = 1 + PUBLIC_INPUT_SIZE + FD_CONST_SIZE;
   var FD_DESC_SIZE =  FD_CONST_SIZE + // The number of ``constants'' in the FD
                        (N_CONDITIONALS + 1) + // The number of ``next state''
                        (N_CONDITIONALS * MAX_AND_SIZE) + // The number of and selectors for conditionals
                        (N_CONDITIONALS * 2) + // The number of signals for muxing the conditional types
                        (N_CONDITIONALS * 2) + // The number of signals for selecting the mux input
                        (BUFFER_SIZE * 3) + // The number of signals for selecting the buffer inputs
                        (BUFFER_SIZE * 2); // The number of signals for selecting the buffer mux type

	/************* Next Intent *************/
   signal public input next_intent;
	/************* End Next Intent *************/

	/******************* Mind Space Commitments **************/
   signal input mind;
   signal public input mind_comm;
   signal input mind_randomness;
   component mind_comm_check = PoseidonElemCommitment();
   mind_comm ==> mind_comm_check.comm;
   mind ==> mind_comm_check.elem;
   mind_randomness ==> mind_comm_check.randomness;

   signal input next_mind;
   signal public input next_mind_comm;
   signal input mind_randomness;
   component next_mind_comm_check = PoseidonElemCommitment();
   next_mind_comm ==> next_mind_comm_check.comm;
   next_mind ==> next_mind_comm_check.elem;
   next_mind_randomness ==> next_mind_comm_check.randomness;
   /******************* End Mind Space Commitment **********/

	/******************* General FD inputs ******************/
   signal public input pub_inputs[PUBLIC_INPUT_SIZE];
   /****************** End General FD inputs *********************/
   
   /****************** Mind FD inputs *********************/
   signal public input mind_FD_comm;
   signal input mind_FD_comm_randomness;
   signal input mind_next_state[N_CONDITIONALS + 1];
	signal input mind_and_selectors[N_CONDITIONALS][MAX_AND_SIZE];
	signal input mind_constant_inputs[FD_CONST_SIZE];
	// Range over 0-2 to select from eq, lt, and lte
	signal input mind_conditional_mux_sel[N_CONDITIONALS][2];
	// Range over inputs and buffer inputs for the inputs into conditionals
	signal input mind_conditional_inputs_mux_sel[N_CONDITIONALS][2];
	// Range over selectors for the inputs and buffers with smaller indices so we can chain things
	signal input mind_buffer_mux_sel[BUFFER_SIZE][3];
	signal input mind_buffer_type_sel[BUFFER_SIZE][2];

   component fd_mind = FDStep(BUFFER_SIZE, PUBLIC_INPUT_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE);
   mind_FD_comm ==> fd_mind.FD_comm;
   mind_FD_comm_randomness ==> fd_mind.FD_comm_randomness;
   mind ==> fd_mind.mind;

   for (var i = 0; i < PUBLIC_INPUT_SIZE; i++) pub_inputs[i] ==> fd_mind.pub_inputs[i];
   for (var i = 0; i < N_CONDITIONALS + 1; i++) mind_next_state[i] ==> fd_mind.next_state[i];
   for (var i = 0; i < N_CONDITIONALS; i++)
      for (var j = 0; j < MAX_AND_SIZE; j++)
         mind_and_selectors[i][j] ==> fd_mind.and_selectors[i][j];
   for (var i = 0; i < FD_CONST_SIZE; i++) mind_constant_inputs[i] ==> fd_mind.constant_inputs;
   for (var i = 0; i < N_CONDITIONALS; i++) {
      mind_conditional_mux_sel[i][0] ==> fd_mind.conditional_mux_sel[0];
      mind_conditional_mux_sel[i][1] ==> fd_mind.conditional_mux_sel[1];

      mind_conditional_inputs_mux_sel[i][0] ==> fd_mind.conditional_inputs_mux_sel[0];
      mind_conditional_inputs_mux_sel[i][1] ==> fd_mind.conditional_inputs_mux_sel[1];
   }
   for (var i = 0; i < BUFFER_SIZE; i++) {
      mind_buffer_mux_sel[i][0] = fd_mind.buffer_mux_sel[i][0];
      mind_buffer_mux_sel[i][1] = fd_mind.buffer_mux_sel[i][1];
      mind_buffer_mux_sel[i][2] = fd_mind.buffer_mux_sel[i][2];

      mind_buffer_type_sel[i][0] = fd_mind.buffer_type_sel[i][0];
      mind_buffer_type_sel[i][1] = fd_mind.buffer_type_sel[i][1];
   }

	//  TODO: we can just do an assignment and remove next_mind from inputs... is it worth it though?
   next_mind === fd_mind.selected_next;
   /****************** End FD inputs *********************/

   /****************** Intent FD inputs *********************/
   signal public input intent_FD_comm;
   signal input intent_FD_comm_randomness;
   signal input intent_next_state[N_CONDITIONALS + 1];
	signal input intent_and_selectors[N_CONDITIONALS][MAX_AND_SIZE];
	signal input intent_constant_inputs[FD_CONST_SIZE];
	// Range over 0-2 to select from eq, lt, and lte
	signal input intent_conditional_mux_sel[N_CONDITIONALS][2];
	// Range over inputs and buffer inputs for the inputs into conditionals
	signal input intent_conditional_inputs_mux_sel[N_CONDITIONALS][2];
	// Range over selectors for the inputs and buffers with smaller indices so we can chain things
	signal input intent_buffer_mux_sel[BUFFER_SIZE][3];
	signal input intent_buffer_type_sel[BUFFER_SIZE][2];

   component fd_intent = FDStep(BUFFER_SIZE, PUBLIC_INPUT_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE);
   mind_FD_comm ==> fd_intent.FD_comm;
   mind_FD_comm_randomness ==> fd_intent.FD_comm_randomness;
   mind ==> fd_intent.mind;

   for (var i = 0; i < PUBLIC_INPUT_SIZE; i++) pub_inputs[i] ==> fd_intent.pub_inputs[i];
   for (var i = 0; i < N_CONDITIONALS + 1; i++) intent_next_state[i] ==> fd_intent.next_state[i];
   for (var i = 0; i < N_CONDITIONALS; i++)
      for (var j = 0; j < MAX_AND_SIZE; j++)
         intent_and_selectors[i][j] ==> fd_intent.and_selectors[i][j];
   for (var i = 0; i < FD_CONST_SIZE; i++) intent_constant_inputs[i] ==> fd_intent.constant_inputs;
   for (var i = 0; i < N_CONDITIONALS; i++) {
      intent_conditional_mux_sel[i][0] ==> fd_intent.conditional_mux_sel[0];
      intent_conditional_mux_sel[i][1] ==> fd_intent.conditional_mux_sel[1];

      intent_conditional_inputs_mux_sel[i][0] ==> fd_intent.conditional_inputs_mux_sel[0];
      intent_conditional_inputs_mux_sel[i][1] ==> fd_intent.conditional_inputs_mux_sel[1];
   }
   for (var i = 0; i < BUFFER_SIZE; i++) {
      intent_buffer_mux_sel[i][0] = fd_intent.buffer_mux_sel[i][0];
      intent_buffer_mux_sel[i][1] = fd_intent.buffer_mux_sel[i][1];
      intent_buffer_mux_sel[i][2] = fd_intent.buffer_mux_sel[i][2];

      intent_buffer_type_sel[i][0] = fd_intent.buffer_type_sel[i][0];
      intent_buffer_type_sel[i][1] = fd_intent.buffer_type_sel[i][1];
   }

	//  TODO: we can just do an assignment and remove next_mind from inputs... is it worth it though?
   next_intent === fd_intent.selected_next;
   /****************** End FD inputs *********************/
}

// component main = FDWrapper(20, 10, 10, 32, 64, 5);
