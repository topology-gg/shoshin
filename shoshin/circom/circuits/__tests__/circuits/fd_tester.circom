pragma circom 2.0.0;
include "../../FDVM.circom";

// Allow for 1,000 steps of the program
// Input size of 10
// Input program size of 100
// And size of 3
component main = FD_VM(3, 5, 5, 32, 3);