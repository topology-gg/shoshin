# Conditions

Conditions are boolean expressions built from Observables, constants, integers, and supported operators.

Examples:
```
// My stamina is below 15 points
SelfSta < 15

// Opponent enters the first frame of backward dash
(OpponentBodyState == BS_BACKWARD_DASH) AND (OpponentBodyCounter == 0)

// The distance between me and opponent is larger than 60 pixels, and opponent's integrity is above 50 points
( ABS(SelfX - OpponentX) > 60 ) AND (OpponentInt > 50)
```

Available constants are the names of the body states for all playable characters, so that players can craft Conditions that detect which body state the player's agent or the opponent agent is in, and act accordingly.

Below is the list of supported operators:
- `+`, `-`, `×`, `÷`
- `≥`, `>`, `≤`, `<`
- `%` (modulo)
- `==` (equal to)
- `ABS` (absolute value)
- `AND` (logical and)
- `OR` (logical or)
- `NOT` (logical inverse)