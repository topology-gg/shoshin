# Architecture

[ insert block diagram here ]

1. Players design their Minds at Shoshin frontend.
2. Upon satisfaction, players submit their Minds onchain to battle against some opponent's Minds.
3. The simulation of the battle between two Minds, over predefined number of frames, is computed in a single transaction onchain. This transaction aggregates all necessary information of every frame into one event and emits the event.
4. The emitted events get indexed, parsed, and visualized at the frontend.

Note:
- The battle simulation logic, implemented in Cairo, is needed at the frontend so that players can iterate on their Mind designs.
- Currently the simulation logic is executed by Cairo-rs via Wasm at the frontend.
  - [Cairo-rs](https://github.com/lambdaclass/cairo-rs) is Lambdaclass's Rust implementation of Cairo VM.