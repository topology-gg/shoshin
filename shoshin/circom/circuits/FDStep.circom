pragma circom 2.0.0;

include "FDEmulator.circom";
include "../circomlib/circuits/poseidon.circom";

/*This circuit template checks that c is the multiplication of a and b.*/  

template FDEvaluator (BUFFER_SIZE, PUBLIC_INPUT_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE) {  
   assert(PUBLIC_INPUT_SIZE <= INPUT_SIZE - 1);
   var FD_CONST_SIZE = INPUT_SIZE - 1 - PUBLIC_INPUT_SIZE;
   var FD_DESC_SIZE =  FD_CONST_SIZE + // The number of ``constants'' in the FD
                        (N_CONDITIONALS + 1) + // The number of ``next state''
                        (N_CONDITIONALS * MAX_AND_SIZE) + // The number of and selectors for conditionals
                        (N_CONDITIONALS * 2) + // The number of signals for muxing the conditional types
                        (N_CONDITIONALS * 2) + // The number of signals for selecting the mux input
                        (BUFFER_SIZE * 3) + // The number of signals for selecting the buffer inputs
                        (BUFFER_SIZE * 2); // The number of signals for selecting the buffer mux type

   signal public input FD_comm;
   signal public input latent_space_comm;
   signal public input next_latent_space_comm;
   signal public input pub_inputs[PUBLIC_INPUT_SIZE];
   
   // Randomness for comm openings
   signal input FD_comm_randomness;
   signal input latent_space_comm_randomness;
   signal input next_latent_space_comm_randomness;

   signal input latent_space;
   
   // Signals for the next event
   signal public input next_intent;

	// Initialize the FD Emulators
   component FD_emulator_latent = FD_Emulator(
      BUFFER_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE
   );
   component FD_emulator_intent = FD_Emulator(
      BUFFER_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE
   );

   component poseidon_FD = Poseidon(FD_DESC_SIZE * 2 + 1); // Two FDs and 1 randomness

   for (var i = 0; i < BUFFER_SIZE; i++) {
      for (var x = 0; x < 3; x++) {
      }
      for (var x = 0; x < 2; x++) {
      }
   }

   for (var i = 0; i < INPUT_SIZE; i++) {
      for (var x = 0; x < 2; x++) {
      }
      for (var x = 0; x < 2; x++) {
      }
      for (var x = 0; x < MAX_AND_SIZE; x++) {
      }
   }

   for (var i = 0; i < FD_CONST_SIZE; i++) {
   }

	component poseidon_latent = Poseidon(2);
   latent_space ==> poseidon_latent.inputs[0];
   latent_space_comm_randomness ==> poseidon_latent.inputs[1];

   component poseidon_next_latent = Poseidon(2);
   FD_emulator_latent.selected_next ==> poseidon_next_latent.inputs[0];
   next_latent_space_comm_randomness ==> poseidon_next_latent.inputs[1];


	// Check that the next intent matches up
   next_intent === FD_emulator_intent.selected_next;   

	// Check that all the commitments match up
   FD_comm === poseidon_FD.out;
   latent_space_comm === poseidon_latent.out;
   next_latent_space_comm === poseidon_next_latent.out;

   // TODO: use multi thingy to check FD commitment...
   
   // Inputs for described the FD_latent and FD_intent
   // TODO:
   // signal...

   
   // Declaration of signals.  
   signal input b;  
   var c = 144;  

   // Constraints.  
   c === a * b;  
}

component main = FDEvaluator();
