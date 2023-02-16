pragma circom 2.0.0;

include "FDEmulator.circom";

/*This circuit template checks that c is the multiplication of a and b.*/  

template FDEvaluator (BUFFER_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE) {  
   signal public input FD_comm;
   signal public input latent_space_comm;
   signal public input next_latent_space_comm;
   signal public input pub_inputs[INPUT_SIZE - 1];
   
   // Randomness for comm openings
   signal input FD_comm_randomness;
   signal input latent_space_comm_randomness;
   signal input next_latent_space_comm_randomness;

   signal input latent_space;
   
   // Signals for the next event
   signal input next_latent_space;
   signal public input next_intent;

	// Initialize the FD Emulators
   component FD_emulator_latent = FD_Emulator(
      BUFFER_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE
   );
   component FD_emulator_intent = FD_Emulator(
      BUFFER_SIZE, INPUT_SIZE, N_CONDITIONALS, N_WORD_BITS, MAX_AND_SIZE
   );

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
