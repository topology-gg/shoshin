import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, ListItemText, Box, Tabs, Tab, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import Draggable from 'react-draggable';
import Paper, { PaperProps } from '@mui/material/Paper';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SpriteAnimator } from 'react-sprite-animator'

interface ContractInformationViewProps {
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

//  hurtable, knockable, clashable; at its last frame, if intent is UPSWING and agent has sufficient stamina, enter its first frame next (instead of returning to IDLE) |

const JessicaInfo = `
## Jessica specification

### Body transition rules
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

### Stamina change
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

### Hitbox dimensions
(to be added)
`

const AntocInfo = `
## Antoc specification

### Body transition rules
| Body state | Duration in frames | Description | Entry Rules | Interruption |
| - | - | - | - | - |
| HORI | 7 | Actively swings her katana upward; 2nd-3rd frames are active | {intent is HORI} when {body is IDLE or last frame of HORI or *8th/9th/10th frame of VERT*} | hurtible; knockable; *not clashable*  |
| VERT | 10 | Actively swings her katana sideway; 4th-5th frames are active | {intent is VERT} when {body is IDLE or last frame of VERT} | hurtible; knockable; *not clashable* |
| BLOCK | 6 | Actively blocks with his great sword; 2nd-5th frames are active | {intent is BLOCK} when {body is IDLE or last frame of BLOCK} | hurtible; knockable |
| HURT | 2 | Involuntarily cringes from being hit | body hit by opponent's attack hitbox | knockable |
| KNOCKED | 11 | Bounces back from being critically hit | body hit by opponent's attack hitbox at low health | *invincible* |
| MOVE FORWARD / BACKWARD | n/a | Walks forward or backward | {intent is DASH FORWARD or DASH BACKWARD} when body responds to locomotive intent | hurtible; knockable; interruptible by locomotive / defensive / offensive intents |
| DASH FORWARD / BACKWARD | 4 | Dashes forward or backward | {intent is DASH FORWARD or DASH BACKWARD} when body responds to locomotive intent | *invincible* |

### Stamina change
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

### Hitbox dimensions
(to be added)
`

const JessicaInfoTag = <ReactMarkdown children={JessicaInfo} remarkPlugins={[remarkGfm]} />
const AntocInfoTag = <ReactMarkdown children={AntocInfo} remarkPlugins={[remarkGfm]} />

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ContractInformationView = () => {

    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={activeTabIndex}
                onChange={(event, number) => setActiveTabIndex((_) => number)}
                aria-label="basic tabs example"
            >
                <Tab label="Jessica" {...a11yProps(0)} />
                <Tab label="Antoc" {...a11yProps(1)} />
            </Tabs>
            </Box>

            <TabPanel value={activeTabIndex} index={0}>
                <SpriteAnimator
                    sprite="/images/jessica/idle/left_spritesheet.png"
                    width={96}
                    height={126}
                    fps={6}
                />
                {JessicaInfoTag}
            </TabPanel>

            <TabPanel value={activeTabIndex} index={1}>
            <SpriteAnimator
                    sprite="/images/antoc/idle/left_spritesheet.png"
                    width={180}
                    height={142}
                    fps={6}
                />
                {AntocInfoTag}
            </TabPanel>
        </div>
    );
};

export default ContractInformationView;
