pragma circom 2.0.0;
include "../../FDEmulator.circom";

// Input buffer = 3
// conditional buffer = 3
// input size = 6
// n single clause conditionals = 3
// n output conditionals = 4
// n word bits = 32
component main = FD_Emulator(3, 3, 6, 3, 4, 32);