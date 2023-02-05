# Proposal

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

### Cryptography Background
We will give a brief overview of the guarantees of private function commitments.
Given a secret function, $g: X \rightarrow Y$, we can get a commitment $C_g = Comm_{f}(g)$. Then, given a $(x, y)$, a verifier can check if $g(x) = y$. More formally, $V_f(C_g, x, y) = 1$ with if $g(x) = y$ and, with overwhelming probability, if $g(x) \neq y$,
then $V_f(C_g, x, y) = 0$. Moreover, $C_g$ does not reveal anything about $g$.

### Proposed protocol

### Modifying FD
We need to modify FD in order to get latent space privacy.

#### 1: Setup Stage
- Setup has to only occur **once** per agent
- Bob and Alice both publicly commit to their FD's and their initial latent space. I.e. they post the following to a ledger.
> $$C_B = Comm_{f}(FD_{B}), C_A = Comm_{f}(FD_{A}), C_{\ell A} = Comm(Lat_A), C_{\ell B} = Comm(Lat_B) $$

#### 2: Evaluation Stage

- Entities involved: Bob's machine, Ana's machine, the blockchain.
- Bob's machine and Ana's machine each run a ZKVM e.g. CairoVM.
- `FD_bob`, `FD_ana`, and `FW` are all implemented in the language executable by said ZKVM.
- Protocol begins at Frame 0 with the following preparation steps:
  - initializes `Obs_0`
- At Frame n ≥ 0:
  1. Bob's machine runs `FD_bob : Obs_n, Lat_bob_n => Lat_bob_n+1, Act_bob_n`. `Act_bob_n` and the validity proof of `FD_bob` execution are submitted onchain.
  2. Ana's machine runs `FD_ana : Obs_n, Lat_ana_n => Lat_ana_n+1, Act_ana_n`. `Act_ana_n` and the validity proof of `FD_ana` execution are submitted onchain.
  3. The blockchain verifies Bob's proof and Ana's proof. If verification passes, the blockchain forwards the World by running `FW : Obs_n, Act_bob_n, Act_ana_n} => Obs_n+1`
- ^ @Lev could you furnish this protocol with functional commitment steps?

### Peer-to-peer version
- (Bob and Ana take turn to run `FW`, each time producing a validity proof to be verified by their counterparty; at the end of the interaction, all proofs are aggregated and submitted onchain in one transaction to be verified onchain)
