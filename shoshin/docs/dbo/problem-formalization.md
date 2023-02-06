# Problem Formalization
Here I (Lev) hope to explicitly formalize the problem.

### The Setup
Say we have to players, Alice and Bob. Let there be some environment
with a set of possible states, $\mathcal{O}$. Let there be a **shared**
set of possible actions, $\mathcal{A}$ and a function $F_W: \mathcal{O} \times \mathcal{A} \rightarrow \mathcal{O}$ which denotes the updating of the world.
Essentially, $F_W$ takes in the current state and an action to perform on the state and updates the current state. All "evaluations" of $F_W$ are entirely public in that the action, current space, next space, and update function
are private.

Then, Alice and Bob both have a secret state which is from the set $\mathcal{L}_A$ for Alice and $\mathcal{L}_{B}$ for Bob.

> Question for Topology: does $\mathcal{L}_A = \mathcal{L}_B$? I.e. is the set of possible secrets the same.

Alice and Bob also have a secret function,
$F_{A}: \mathcal{O} \times \mathcal{L}_A \rightarrow \mathcal{A} \times \mathcal{L}_A$
$F_{B}: \mathcal{O} \times \mathcal{L}_B \rightarrow \mathcal{A} \times \mathcal{L}_B$.

The game is that we start with some globally known state, $o_0 \in \mathcal{O}$ and hidden latent states $a \in \mathcal{L}_A$ for Alice and $b \in \mathcal{L}_B$ for Bob.
Then, assuming Alice makes the first move we compute, for $m$ time steps and i starting at 0:

1. $F_A(o_0, a_0) = (act_a, a_1)$
2. $o_0' = F_W(o_0, act_a)$
3. $F_B(o_0', b_0) = (act_b, b_1)$
4. $o_1 = F_W(o_0', act_b)$.

### Further Restrictions on FDs
We have no further restriction on FDs. Because the domain of $F_A$ and $F_B$ is
relatively small (on the order of 1000), explicitly writing out the input output table
of the FD is doable.

> Question for Topology: Does this make sense?