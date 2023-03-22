# Double Blinding Proposal

### Simplified Notations

**Agent**
1. Each agent is able to perceive Observables, a set of observable quantities denoted by `Obs`, from the world, including observable values about its own state, opponent's state, and the environment.
2. Each agent maintains a Latent state, denoted by `Lat`.
3. Each agent is able to perform an action at any frame. Action is denoted by `Act`
4. Each agent has a *deterministic pure function* that serves the purpose of decision making, denoted by `FD` (Function for Decision-making). Its function signature is as follows:
```
FD : Obs, Lat => Lat', Act
```
where A denotes an Action selected by the decision making function to be performed, and L' denotes the updated latent state.
1. In plain words, an agent would take Observables and its own Latent state into consideration, and run a pure-function decision-making program, which both selects an action to be performed and computes the new Latent state.

**World**
1. The World is forwarded by actions performed by the agents, following this pure function `FW` (Function for World simulation):
```
FW : Obs, {Act} => Obs'
```
2. In plain words, the collection of actions performed by all agents would transform the world from a set of observables to a new set of observables.

**Putting them together**

Putting them together, assuming there are two agents - Agent Bob and Agent Ana.
```
// The World starts at Frame 0, where:
Observables              : Obs_0
Agent Bob's latent state : Lat_bob_0
Agent Ana's latent state : Lat_ana_0

// At Frame n ≥ 0:
Run FD_bob : Obs_n, Lat_bob_n => Lat_bob_n+1, Act_bob_n
Run FD_ana : Obs_n, Lat_ana_n => Lat_ana_n+1, Act_ana_n
Run FW     : Obs_n, Act_bob_n, Act_ana_n => Obs_n+1
```

### Goal
- The goal now is to come up with an interactive protocol that simulates the interaction between two agents, each privately known by its human creator.
- Concretely, an agent's `Lat` and `FD` should remain private throughout the simulation; the actions performed by agents as well as the observable quantities are public.

### Requirements
1. Bob has his agent, which comprises a pure function `FD_bob` and some states `Lat_bob`, located in his machine's memory.
2. Ana has her agent, which comprises a pure function `FD_ana` and some states `Lat_ana`, located in her machine's memory.
3. We must run `FD_bob` on Bob's machine, and run `FD_ana` on Ana's machine.
4. The public should be able to verify: Bob sticks to the same `FD_bob` throughout the simulation, and same with Ana; `Lat_bob` is updated only by `FD_bob`, and `Lat_ana` is updated only by `FD_ana`.

## Proposed protocol

### Representing FD
We consider a very specific representation of FD in order to get latent space privacy and proof efficiency.
Let `FD` be a collection of functions, $\{(\ell_i, f_i)\}$, with each function representing an FD for a specific latent space, $\ell_i$ where $i \in [n]$ and $n$ is the number of latent spaces.
Further, each item, $(\ell, f)$ in the collection `FD` needs a canonical representation. $f_i$ can be represented as the latent space associated with $\ell_i$ via an ordered list of tuples and a default action. Each tuple contains a condition and a returning action if satisfied. The program starts by looking at the first item in the list, if the condition is not satisfied, it continues to the next one and so on. If no condition is met, return a default action.

#### 1: Setup Stage
- Setup has to only occur **once** per agent
- Bob and Alice both publicly commit to their FD's. I.e. they post the following to a ledger.
$$C_B = Comm_{set}(FD_{B}), C_A = Comm_{set}(FD_{A}).$$

$Comm_{set}$ is set commitment, i.e. a Merkle root to a tree where the leaves are hashes of each item in the set.

<!-- #### 2a: Evaluation Stage, Using Only Cairo

- Entities involved: Bob's machine, Ana's machine, the blockchain.
- Bob's machine and Ana's machine each run a ZKVM e.g. CairoVM.
- `FD_bob`, `FD_ana`, and `FW` are all implemented in the language executable by said ZKVM.
- Protocol begins at Frame 0 with the following preparation steps:
  - initializes `Obs_0`
- At Frame n ≥ 0:
  1. Bob's machine runs `FD_bob : Obs_n, Lat_bob_n => Lat_bob_n+1, Act_bob_n`. `Act_bob_n` and the validity proof of `FD_bob` execution are submitted onchain.
  2. Ana's machine runs `FD_ana : Obs_n, Lat_ana_n => Lat_ana_n+1, Act_ana_n`. `Act_ana_n` and the validity proof of `FD_ana` execution are submitted onchain.
  3. The blockchain verifies Bob's proof and Ana's proof. If verification passes, the blockchain forwards the World by running `FW : Obs_n, Act_bob_n, Act_ana_n} => Obs_n+1` -->

#### 2: Evaluation Stage, Blockchain Verified and Private
- Entities involved: Bob's machine, Ana's machine, the blockchain.
- `FW` is implemented within a smart contract.
- Protocol begins at Frame 0 with the following preparation steps:
  - initializes `Obs_0`
- At Frame n ≥ 0:
  1. Bob and Alice both post a commitment to their latent space — $C_{\ell A} = Comm(Lat_A), C_{\ell B} = Comm(Lat_B)$ — to the blockchain.
  2. Bob's machine runs `FD_bob : Obs_n, Lat_bob_n => Lat_bob_n+1, Act_bob_n`. `Act_bob_n` and the validity proof of `FD_bob` execution are submitted onchain.
  3. Ana's machine runs `FD_ana : Obs_n, Lat_ana_n => Lat_ana_n+1, Act_ana_n`. `Act_ana_n` and the validity proof of `FD_ana` execution are submitted onchain.
  4. The blockchain verifies Bob's proof and Ana's proof. If verification passes, the blockchain forwards the World by running `FW : Obs_n, Act_bob_n, Act_ana_n} => Obs_n+1`



### Peer-to-peer (interactive) version
- (Bob and Ana take turn to run `FW`, each time producing a validity proof to be verified by their counterparty; at the end of the interaction, all proofs are aggregated and submitted onchain in one transaction to be verified onchain)
#### Validity proof
In the interactive version, we can use a variety of primitives. For now though, we will use vanilla ZK Snarks. Efficiency gains can be achieved with more complex primitives, but may not be required. These will be discussed in a later section (practical considerations).

To prove an $FD$ ran correctly according to a latent space commitment $C_\ell$, we will use a ZK-Snark. The ZK-Snark can be thought of as a "universal evaluator" for the FD programs and a verifier. To create a proof, we will require the `FD` holder to prove the following:

**Proof of action**: Given a public outputted action $a$, environment state $o$, $C_\ell$ commitment, and $C_{FD}$ commitment, they know a Merkle path for the canonical representation of the $FD$ item, $(\ell, f)$, such that $f(o) = a$, and $\ell$ matches $C_\ell$.

> *Why does this work?*
> Note that the set membership proves that we are using a function which we already committed to. We also prove that we are using the function associated with the current latent space commitment. Moreover, the proof shows that $f(o) = a$. Note that this requires the prover to actually prove the evaluation of $f$ within the Snark.

#### Practicality considerations
Using Snark friendly hash functions (like Poseidon), we can quickly generate membership proves (for $C_{FD}$) and commitment proofs (for $C_\ell$). Problems start to arise when members, $f$, of $FD$ become longer and more complex. Non-native modulo operations and comparison ($<, >, \leq, \geq$) can quickly become expensive to prove. This would not hurt verification time too much, but would hurt prover time. For now, if functions are simple enough, this should not be too large of a problem. In the future, we could use **private function commitments** instead. Function commitments are ways to prove that, for a private $f$ and public $x, y$, $f(x) = y$. But, if we were to verify function commitments on chain right now, we would have to reveal the latent space! (There are ways to somewhat get around this, but the latent space would be at least partially leaked after evaluations).

There are a few potential solutions in the future:
1. There is a line of research which can combine private function commitments with partially private inputs (I am involved in this work). It's very far from theory or production ready
2. Alternatively, we use recursive proving. A very [recent paper](https://eprint.iacr.org/2021/370) and [Github repository](https://github.com/microsoft/Nova) build practical recursive schemes (**definitely worth checking out**). So, with a bit of research on the more theoretical side, we (i.e. the community) may be able to build private function commitments out of Nova. Then, we can do things like verify the private function commitments within a ZK Snark and thus keep the latent space private.