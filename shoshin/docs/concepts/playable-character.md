# Playable Character

### Jessica
#### Body transition rules
| Body state | Duration in frames | Description | Entry Rules | Interruption |
| - | - | - | - | - |
| UPSWING | 5 | Actively swings her katana upward; 3rd frame is active | {intent is UPSWING} when {body is IDLE or last frame of UPSWING} | hurtible; knockable; clashable |
| SIDECUT | 5 | Actively swings her katana sideway; 3rd frame is active | {intent is SIDECUT} when {body is IDLE or last frame of SIDECUT} | hurtible; knockable; clashable |
| SLASH | 5 | Actively swings her katana downward; 3rd frame is active | {intent is SLASH} when {body is IDLE or last frame of SLASH} | hurtible; knockable; clashable |
| BLOCK | 3 | Actively blocks with her katana; 2nd frame is active | {intent is BLOCK} when {body is IDLE or last frame of BLOCK} | hurtible; knockable |
| CLASH | 4 | Involuntarily retracts her katana from clashing with opponent's weapon | the two players' attack hitboxes overlap | hurtible; knockable |
| HURT | 2 | Involuntarily cringes from being hit | body hit by opponent's attack hitbox | knockable |
| KNOCKED | 11 | Bounces back from being critically hit | body hit by opponent's attack hitbox at low health, *or attack when opponent is Antoc in blocking* | *invincible* |
| MOVE FORWARD / BACKWARD | n/a | Walks forward or backward | {intent is DASH FORWARD or DASH BACKWARD} when body responds to locomotive intent | hurtible; knockable; interruptible by locomotive / defensive / offensive intents
| DASH FORWARD / BACKWARD | 4 | Dashes forward or backward | {intent is DASH FORWARD or DASH BACKWARD} when body responds to locomotive intent | *invincible*; *interruptible by offensive intents* |

#### Stamina change
| Body state | Change | Note |
| - | - | - |
| No action | +20 | stamina replenishes per frame |
| Move forward | +20 | stamina replenishes per frame |
| Move backward | +20 | stamina replenishes per frame |
| Block | +10 | stamina replenishes per frame |
| Dash forward | -50 | stamina consumed once when body enters the state |
| Dash backward | -50 | stamina consumed once when body enters the state |
| Upswing | -100 | stamina consumed once when body enters the state |
| Sidecut | -100 | stamina consumed once when body enters the state |
| Slash | -100 | stamina consumed once when body enters the state |

### Antoc

#### Body transition rules
| Body state | Duration in frames | Description | Entry Rules | Interruption |
| - | - | - | - | - |
| HORI | 7 | Actively swings her katana upward; 2nd-3rd frames are active | {intent is HORI} when {body is IDLE or last frame of HORI or *8th/9th/10th frame of VERT*} | hurtible; knockable; *not clashable*  |
| VERT | 10 | Actively swings her katana sideway; 4th-5th frames are active | {intent is VERT} when {body is IDLE or last frame of VERT} | hurtible; knockable; *not clashable* |
| BLOCK | 6 | Actively blocks with his great sword; 2nd-5th frames are active | {intent is BLOCK} when {body is IDLE or last frame of BLOCK} | hurtible; knockable |
| HURT | 2 | Involuntarily cringes from being hit | body hit by opponent's attack hitbox | knockable |
| KNOCKED | 11 | Bounces back from being critically hit | body hit by opponent's attack hitbox at low health | *invincible* |
| MOVE FORWARD / BACKWARD | n/a | Walks forward or backward | {intent is DASH FORWARD or DASH BACKWARD} when body responds to locomotive intent | hurtible; knockable; interruptible by locomotive / defensive / offensive intents |
| DASH FORWARD / BACKWARD | 4 | Dashes forward or backward | {intent is DASH FORWARD or DASH BACKWARD} when body responds to locomotive intent | *invincible* |

#### Stamina change
| Body state | Change | Note |
| - | - | - |
| No action | +20 | stamina replenishes per frame |
| Move forward | +20 | stamina replenishes per frame |
| Move backward | +20 | stamina replenishes per frame |
| Block | +10 | stamina replenishes per frame |
| Dash forward | -50 | stamina consumed once when body enters the state |
| Dash backward | -50 | stamina consumed once when body enters the state |
| Hori | -100 | stamina consumed once when body enters the state |
| Vert | -100 | stamina consumed once when body enters the state |