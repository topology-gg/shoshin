# Introduction

Shoshin is a 2D fighting game for UGAI: user-generated AI.

Player designs Agents and submits them to fight other submitted Agents.

An Agent comprises a [Mind](concepts/mind.md) and a choice of [playable character](concepts/playable-character.md). Each playable character comes with a distinct [Body](concepts/body.md).

The Mind pilots the Body.

A Mind:
- perceives [Observables](concepts/body.md) about its own agent, the opponent agent, and the environment.
- decides on which [Intent](concepts/intent.md) to drive the Body.
- can inhabit a state at any given moment among the inhabitable states defined by player. this is called mental state or state of mind. For details, visit the [Mind](concepts/mind.md) section.

A Body:
- receives Intent from the Mind.
- receives [Stimulus](concepts/stimulus.md) from the environment - such as being struck by opponent's weapon.
- updates its state - called body state - depending on the received Intent, Stimulus, and its previous body state.
