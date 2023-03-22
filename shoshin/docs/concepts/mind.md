# Mind

- The Mind occupies one state at any given frame - also known as "state of mind".
- At any state of mind, a transition function determines which state of mind to occupy next.
- Every state of mind has a corresponding Intent. The agent takes the Intent associated with its current state of Mind to drive the Body.

More technically:
- The Mind is a stateful program used by agent to decide on an Intent at every frame.
- The Mind is structured as a [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine), where the state transition function - Transition in short - at each state is implemented as a [binary tree](https://en.wikipedia.org/wiki/Binary_tree) built from Conditions.
- The player designs the Mind by designing this finite state machine - defining the states as well as the Transitions.

Examples of a Transition, expressed via a [*Rust-like pattern matching syntax*](https://doc.rust-lang.org/book/ch18-03-pattern-syntax.html):
```
The next state of mind is:
    If Condition 1 (C1) is true => BLOCKING
    If Condition 2 (C2) is true => SIGNATURE_COMBO
    Else => FINISHER
```

The above pseudocode can be visualized as (**TODO**: update figure to match the pseudocode above):

<img src="/assets/images/transition_example.png" width="40%"/>