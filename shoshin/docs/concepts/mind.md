# Mind

- The Mind occupies one state at any given frame - also known as "state of mind".
- At any state of mind, a transition function determines which state of mind to occupy next.
- Every state of mind has a corresponding Action. The agent performs the Action associated with its current state of mind.

More technically:
- The Mind is a stateful program used by agent to decide which action to perform.
- The Mind is structured as a [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine), where the state transition function - Transition in short - at each state is implemented as a [binary tree](https://en.wikipedia.org/wiki/Binary_tree) built from Conditions.
- The player designs the Mind by designing this finite state machine - defining the states as well as the Transitions.

Examples of a Transition:
```
if Condition F1 is true => the next state of mind is MS_BLOCK
else =>
    if Condition F2 is true => the next state of mind is MS_COMBO
    else => the next of mind is MS_CLOSER
```
<img src="/assets/images/transition_example.png" width="40%"/>