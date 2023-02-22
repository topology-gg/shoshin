# Physics

Depending on body state, the character's dynanmics is computed.

Dynamics includes position, velocity, and acceleration.

Collision is handled in order to compute [Stimulus](concepts/stimulus.md), which is applied in the next frame.

### Hitboxes and Collision

Each character has a Body Hitbox (rectangle) that denotes the area of its body.

If performing an offensive or defensive action, the character would have Active Hitbox that denotes the area of the action.

Collisions among the hitboxes are detected and handled.

Example of the Body and Active Hitboxes, as visualized by shoshin-tooling frontend:

<img src="/assets/images/hitbox_example.png" width="35%"/>

^Body Hitboxes have yellow borders, while Active Hitboxes have red borders.