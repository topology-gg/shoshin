# Mind-Body Separation

### The Mind-Body Separation (MBS; 靈肉分離)
- The Mind is free to imagine and to decide, but the Body is constrained by physics and its capability (心靈可以自由聯想，肉體受物理和本身素質限制).
- The Mind may want the Body to enter a particular state, but the Body may not be able to because of physical constraint. For example, the Body can not jump again if already in mid-air, unless double-jumping is allowed in physics. (能否變招受物理限制)
- The Mind may want the Body to enter a particular state, but the Body may not be able to because of its capability limitation. For example, a less powerful Body may not be able to transition from the pinnicle phase of an attack pose in the previous frame immediately into the starting phase of a defensive pose in the current frame. (能否變招由肉體素質決定)
- Therefore, the Mind does not drive the pose and physicality of the Body directly. There exists an Action layer that mediates between the Mind and the Body. The Mind decides on which Action to perform. The Body is influenced by the Action in transitioning between body states. (心靈決定行動；行動影響肉體狀態的轉換)
- Action can be understood as intent, through which the Mind influences the Body. (行動又稱為意圖)

### The Mind (心靈)

The Mind:
- maintains some states (memories)
- receives Observables perceived about itself, the opponent, or the environment
- runs algorithms to determine its Action (equivalently: intent - what to do with the body) and to modify its states (update memories)
- is "Turing Complete" - able to execute algorithms of arbitrary complexity for its own decision-making (note: complexity is constrained by concrete implementation of the Shoshin simulator system; complexity may translate to cost to avoid spamming)

### The Body (肉體)

The Body:
- receives Action (intent) from the Mind
- can be in various state (equivalently: body pose)
- is constrained to reflect the physicality of the body
  - for example, the body is not able to transition from a partcular offensive pose immediately to the defensive pose (無法任意變招)
  - for example, when transitioning from pose 1 to pose 2 *before* pose 1 is completed, stamina cost is incurred (變招消耗體力)

### How does a player design an agent?
- Design the Mind - define various states of mind, and the Action associated with each state of mind.
- Design the transition function for each state of mind.
- Design the Conditions required for constructing the transition functions for each state of mind.
