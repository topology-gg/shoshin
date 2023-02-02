# Summary


### Notations
- **Observables**: variables that can be observed by agents for decision-making. Examples include health points, positions, velocities, and body states.
- **Conditions**: boolean (true/false) expressions built from Observables, constants, and supported operators.
- **Mind**: a stateful function that makes use of Conditions to decide which Action to perform.
- **Action**: also known as *intent* - the Mind's output, which drives the Body. There are two kinds of Action:
  - **Atomic Action** takes one frame to execute.
  - **Combo Action** is formed by a sequence of Atomic Actions.
- **Stimulus**:
- **Body**: the state, or posture, of the agent's character body. For example, a Body can be in Idle state, Forward Dash state, and an attack state.
- **Physics**: the dynamics of the agent's character, consisting of position, velocity, and acceleration.

### Pseudocode at the high level

```
// For Agent 0 (A0) and Agent 1 (A1)

Init World, A0's Mind and A1's Mind

For Frame in 0..N:
    run Perception Phase
    run Mind Phase for A0 & A1
    run Action Phase for A0 & A1
    run Body Phase for A0 & A1
    run Physics Phase for A0 & A1
```

### Pseudocode for each phase

For Frame `n > 0`:

**Perception Phase**: Given the body states and physics states of all agents from the last frame, produce the observable values for this frame.
```
Body_A0_n-1, Physics_A0_n-1 => Observables_n
```
(note: currently all observables are accessible to all agents i.e. there is no private observables)

**Mind Phase**: For each agent, given the current observables and its state of mind from the last frame, produce its state of mind for this frame.
```
Observables_n, A0_Mind_n-1 => A0_Mind_n
Observables_n, A1_Mind_n-1 => A1_Mind_n
```

**Action Phase**: For each agent, given its current state of mind, find its corresponding action to perform for this frame.
```
A0_Mind_n => A0_Action_n
A1_Mind_n => A1_Action_n
```

**Body Phase**: For each agent, given the stimulus it received from the last frame, its body state from the last frame, and its current action, compute its body state for this frame.
```
A0_Stimulus_n-1, A0_Body_n-1, A0_Action_n => A0_Body_n
A1_Stimulus_n-1, A1_Body_n-1, A1_Action_n => A1_Body_n
```

**Physics Phase**: For each agent, given its physics state from the last frame and its current body state, compute its physics state and stimulus received for this frame.
```
A0_Physics_n-1, A0_Body_n => A0_Physics_n, A0_Stimulus_n
A1_Physics_n-1, A1_Body_n => A1_Physics_n, A1_Stimulus_n
```
