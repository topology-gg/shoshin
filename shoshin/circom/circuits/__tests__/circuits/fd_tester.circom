pragma circom 2.0.0;
include "../../FDEmulator.circom";

// Allow for 1,000 steps of the program
// Input size of 10
// Input program size of 100
// And size of 3
component main = FD_Emulator(3, 5, 5, 32, 3);