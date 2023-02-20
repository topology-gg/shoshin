pragma circom 2.0.0;
include "../../FDWrapper.circom";

// 32 buffers, 5 public inputs, 10 FD constants, 32 conditionals, 32 bit words, and max and size of 5
component main = FD_Emulator(32, 5, 10, 32, 32, 5);