# Summary


### Notations
- Observables:
- Conditions
- Mind
- Stimulus
- Body
- Physics

### Pseudocode
For Agent 0 (`A0`) and Agent 1 (`A1`) at Frame `n > 0`:

**Perception phase**
```
Body_A0_n-1, Physics_A0_n-1 => Observables_n
```

**Mind phase**
```
Observables_n, A0_Mind_n-1 => A0_Mind_n
Observables_n, A1_Mind_n-1 => A1_Mind_n
```

**Action phase**
```
A0_Mind_n => A0_Action_n
A1_Mind_n => A1_Action_n
```

**Body phase**
```
A0_Stimulus_n-1, A0_Body_n-1, A0_Action_n => A0_Body_n
A1_Stimulus_n-1, A1_Body_n-1, A1_Action_n => A1_Body_n
```

**Physics phase**
```
A0_Physics_n-1, A0_Body_n => A0_Physics_n, A0_Stimulus_n
A1_Physics_n-1, A1_Body_n => A1_Physics_n, A1_Stimulus_n
```
