pragma circom 2.0.0;
include "../../FDVM.circom";

// Allow for 1,000 steps of the program
// Input size of 10
// Input program size of 100
component main = FD_VM(1000, 100, 100);