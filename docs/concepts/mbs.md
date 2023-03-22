# Mind-Body Separation

### The Mind-Body Separation (MBS; 靈肉分離)
- The Mind is free to imagine and to decide, but the Body is constrained by physics and its capability (心靈可以自由聯想，肉體受物理和本身素質限制).
- The Mind may want the Body to enter a particular state, but the Body may not be able to because of physical constraint. For example, the Body can not jump again if already in mid-air, unless double-jumping is allowed in physics. (能否變招受物理限制)
- The Mind may want the Body to enter a particular state, but the Body may not be able to because of its capability limitation. For example, a less powerful Body may not be able to transition from the pinnicle phase of an attack pose in the previous frame immediately into the starting phase of a defensive pose in the current frame. (能否變招由肉體素質決定)
- Therefore, the Mind does not drive the pose and physicality of the Body directly. There exists an Intent layer (indirectionality, technically speaking) that mediates between the Mind and the Body.
- In short, **The Mind produces an Intent; the Body is influenced by that Intent when transitioning between body states**. (心靈產生意圖；意圖影響肉體狀態的轉換)

### The Mind (心靈)

The Mind:
- maintains some states (memories)
- receives Observables perceived about itself, the opponent, or the environment
- runs algorithms to determine its Intent and to modify its states (update memories)
- is "Turing Complete" - able to execute algorithms of arbitrary complexity for its own decision-making (note: complexity is constrained by concrete implementation of the Shoshin simulator system; complexity may translate to cost to avoid spamming)

### The Body (肉體)

The Body:
- receives Intent from the Mind
- can be in various state (equivalently: body pose)
- is constrained to reflect its physicality
  - for example, the body is not able to transition from a partcular offensive pose immediately to the defensive pose (無法任意變招)
  - for example, when transitioning from pose 1 to pose 2 *before* pose 1 is completed, stamina cost is incurred (變招消耗體力)

### How does a player design an agent?
- Design the [Mind](concepts/mind.md) - define various states of mind, and define the Intent associated with each state of mind.
- Design the transition function for each state of mind.
- Design the [Conditions](concepts/conditions.md) required for constructing the transition functions for each state of mind.
