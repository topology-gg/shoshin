Some scratch:

we need
- FD collection txt >> Merkle tree (probably the JS/ TS file). Check out [this TS circom merkle lib](https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/incremental-merkle-tree)
- Generate proof for FD
- FD's put out a next merkle state! So we have to feed in a "commitment" for the next state into the current state to prove correctness. We then have to show that the next commitment matches with the FD