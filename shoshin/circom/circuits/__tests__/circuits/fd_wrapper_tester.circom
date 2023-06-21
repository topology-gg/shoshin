pragma circom 2.0.0;
include "../../FDWrapper.circom";

// Dict size = 4
// Constant size = 4
// trace size = 30
// n word bits = 96
// 4 Merkle Tree Levels (for 8 Minds)
component main {public [current_mind_comm, input_dict, mt_root]} = FD_Wrapper(4, 4, 30, 96, 4);
