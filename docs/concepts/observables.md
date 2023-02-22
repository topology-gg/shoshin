# Observables

The following list of observables are available for both the agent's own character and the opponent agent's character:
- `(X,Y)`: position (bottom left corner of the character's body hitbox)
- `(VelX,VelY)`: velocity
- `(AccX,AccY)`: acceleration
- `Dir`: direction that the character is facing (left = 0; right = 1)
- `Int`: integrity (similar to health point)
- `Sta`: stamina
- `BodyState`: the state of the body. For details, go to [Body](concepts/body.md).
- `BodyCounter`: which frame (pose) of the current body state. For details, go to [Body](concepts/body.md).
