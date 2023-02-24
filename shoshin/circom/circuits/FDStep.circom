pragma circom 2.0.0;

include "FDEmulator.circom";
include "../circomlib/circuits/poseidon.circom";

/*This circuit template checks that c is the multiplication of a and b.*/  

template FDStep (INPUT_TRACE_SIZE, PUBLIC_INPUT_SIZE, INPUT_SIZE, N_SIGNLE_CLAUSE_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE) {  
   assert(PUBLIC_INPUT_SIZE <= INPUT_SIZE - 1);
   var FD_CONST_SIZE = INPUT_SIZE - 1 - PUBLIC_INPUT_SIZE;
   var FD_DESC_SIZE =  FD_CONST_SIZE + // The number of ``constants'' in the FD
                        (N_SIGNLE_CLAUSE_CONDITIONALS + 1) + // The number of ``next state''
                        (N_SIGNLE_CLAUSE_CONDITIONALS * MAX_AND_SIZE) + // The number of and selectors for conditionals
                        (N_SIGNLE_CLAUSE_CONDITIONALS * 2) + // The number of signals for muxing the conditional types
                        (N_SIGNLE_CLAUSE_CONDITIONALS * 2) + // The number of signals for selecting the mux input
                        (INPUT_TRACE_SIZE * 3) + // The number of signals for selecting the trace inputs
                        (INPUT_TRACE_SIZE * 2); // The number of signals for selecting the trace mux type

   signal public input FD_comm;
   // TODO: these into a different component
   // signal public input mind_comm;
   // signal public input next_mind_comm;
   signal public input pub_inputs[PUBLIC_INPUT_SIZE];
   
   // Randomness for comm openings
   signal input FD_comm_randomness;
   // signal input mind_comm_randomness;
   // signal input next_mind_comm_randomness;

   signal input mind;

	//  TODO: hmmmmm..... one proof or two? I guess we could just like split it up anywho later...
   /********** Signals for describing FD ****************/
	signal input next_state[N_SIGNLE_CLAUSE_CONDITIONALS + 1];
	signal input and_selectors[N_SIGNLE_CLAUSE_CONDITIONALS][MAX_AND_SIZE];
	signal input constant_inputs[FD_CONST_SIZE];
	// Range over 0-2 to select from eq, lt, and lte
	signal input conditional_mux_sel[N_SIGNLE_CLAUSE_CONDITIONALS][2];
	// Range over inputs and trace inputs for the inputs into conditionals
	signal input conditional_inputs_mux_sel[N_SIGNLE_CLAUSE_CONDITIONALS][2];
	// Range over selectors for the inputs and traces with smaller indices so we can chain things
	signal input trace_mux_sel[INPUT_TRACE_SIZE][3];
	signal input trace_type_sel[INPUT_TRACE_SIZE][2];
   /********** Signals for describing FD ****************/

   signal output selected_next;
   
   // Signals for the next event
   // signal public input next_intent;

	// Initialize the FD Emulators
   
   component FD_emulator = FD_Emulator(
      INPUT_TRACE_SIZE, INPUT_SIZE, N_SIGNLE_CLAUSE_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE
   );

   component poseidon_FD = Poseidon(FD_DESC_SIZE + 1); // Two FDs and 1 randomness

	// TODO: IN THE BELOW SET UP EMULATOR INPUTS AND POSEIDON INPUTS
   // TODO: there has to be a better way of quick setting...
   var cum_pos = 0;
   for (var i = 0; i < INPUT_TRACE_SIZE; i++) {
      for (var x = 0; x < 3; x++) {
         trace_mux_sel[i][x] ==> FD_emulator.trace_mux_sel[i][x];
         trace_mux_sel[i][x] ==> poseidon_FD[cum_pos];
         cum_pois += 1;
      }
      for (var x = 0; x < 2; x++) {
         trace_type_sel[i][x] ==> FD_emulator.trace_type_sel[cum_pois];
         trace_type_sel[i][x] ==> poseidon_FD[cum_pos];
         cum_pos += 1;
      }
   }

   for (var i = 0; i < N_SIGNLE_CLAUSE_CONDITIONALS; i++) {
      for (var x = 0; x < 2; x++) {
         conditional_inputs_mux_sel[i][x] ==> FD_emulator.conditional_inputs_mux_sel[i][x];
         conditional_inputs_mux_sel[i][x] ==> poseidon_FD[cum_pos];
         cum_pos += 1;
      }
      for (var x = 0; x < 2; x++) {
         conditional_mux_sel[i][x] ==> FD_emulator.conditional_mux_sel[i][x];
         conditional_mux_sel[i][x] ==> poseidon_FD[cum_pos];
         cum_pos += 1;
      }
      for (var x = 0; x < MAX_AND_SIZE; x++) {
         and_selectors[i][x] ==> FD_emulator.and_selectors[i][x];
         and_selectors[i][x] ==> poseidon_FD[cum_pos];
         cum_pos += 1;
      }
      next_state[i] ==> FD_emulator.next_state[i];
      next_state[i] ==> poseidon_FD[cum_pos];
      cum_pos += 1;
   }
   next_state[N_SIGNLE_CLAUSE_CONDITIONALS] ==> FD_emulator.next_state[N_SIGNLE_CLAUSE_CONDITIONALS];
   next_state[N_SIGNLE_CLAUSE_CONDITIONALS] ==> poseidon_FD[cum_pos];
   cum_pos += 1;

   for (var i = 0; i < FD_CONST_SIZE; i++) {
      constant_inputs[i] ==> FD_emulator.inputs[1 + PUBLIC_INPUT_SIZE + i];
      constant_inputs[i] ==> poseidon_FD[cum_pos];
      cum_pos += 1;
   }

   for (var i = 0; i < PUBLIC_INPUT_SIZE; i++) {
      pub_inputs[i] ==> FD_emulator.inputs[1 + i];
   }
   mind ==> FD_emulator.inputs[0];

   // Set the randomness for the commitment
   FD_comm_randomness ==> poseidon_FD[cum_pos];

	// Check the commitment
   FD_comm === poseidon_FD.out;
   selected_next <== FD_emulator.selected_next;
}

// component main = FDS();
