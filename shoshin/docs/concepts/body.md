# Body


### Body Diagram
- The Body is represented by a state machine called Body Diagram.
- Each character type corresponds to a vastly different Body Diagram.
- At any given frame, the Body occupies a body state available in its Body Diagram.
- The Body transitions between various body states as dictated by the Body Diagram, which takes into consideration the [Stimulus](concepts/stimulus.md) received by the Body.

A code excerpt in Cairo 0.11 that defines a body state and how it transitions to other body states:
<img src="/assets/images/body_state_code_example.png" width="85%"/>

^TODO: replace this with visualization.

**Note:**
in the future we may introduce body like vehicles, which may belong to a particular type, but vehicles of the same type would differ in their parameters; vehicles may be improved and modified. This makes both Mind and Body as ownable assets)

