# Shoshin

![image](https://user-images.githubusercontent.com/59590480/171427247-fcb4c4c6-a817-4b62-be50-27889b3ade61.png)

(ref: https://www.pinterest.ch/pin/370139663120470164/)

#### Assumption

-   2 agents, each able to
    -   move their character-hitbox
    -   create / remove their action-hitbox
-   there are two vertical walls marking the left and right boundaries

#### Notation

-   denoting `Agent === Agent State Machine`
-   denoting `Object === Object State Machine (character state machine)`

#### Compute events

Listing all the computation and their dependencies, with the goal of creating a robust compute sequence.

-   {collision events} + {Agent action} + {current Object state} => {next Object state}
-   {perception} + {current Object state} + {current Agent state} => {next Agent state} + {Agent action}
-   All {current Object state} + All {current Physics state} => All {new Physics state} + {collision events}
-   {Physics state} => {perception}

Expressing the above functions in succinct notations

-   Object state transition: $\overrightarrow{c} + A_a + O_s \rightarrow O_s'$
-   Agent state transition + performing action: $\overrightarrow{p} + O_s + A_s \rightarrow A_s' + A_a$
-   Scene physical state changes + registering collision events: $\sum O_s + \sum P_s \rightarrow \sum P_s' + \overrightarrow{c}$
-   Encoding scene physical state into perceptibles: $\sum P_s \rightarrow \overrightarrow{p}$

### Ordering of compute events per tick for agents, object states, and character physical states

```

## Percept from character & environment physicality
C_1, C_2 => P

## Agency
A_i, P => A_i' , a_i
(for all i)

## Reset perceptibles
P = 0

## Object state
O_i, a_i, S => O_i'
(for all i)

## Reset stimuli
S = 0

## Character & environment physicality
Σ C_i, Σ O_i' => Σ C_i', S

```

#### Features / directions to be patiently pursued and announced

-   random variables and distributions availabie in SE
-   programming the `Percept()` function directly, which takes raw perceptibles as input and returns custom perceptibles / features as output
-   tokenomics to drive innovation on meta across all asymmetric factions/characters (see Notion)
-   standardizing Object and Agent such that other onchain reality can choose to be compatible with Object standard, thus allowing NPC (compatible to Agent standard) to travel across realities, realizing AI interoperability.
