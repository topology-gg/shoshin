import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { Close } from '@mui/icons-material';
import Draggable from 'react-draggable';
import Paper, { PaperProps } from '@mui/material/Paper';
import ReactMarkdown from 'react-markdown'
import ReactDom from 'react-dom'
import remarkGfm from 'remark-gfm'

interface ContractInformationProps {
  title: string
  onClose: () => void
  open: boolean
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

const info = `
## Jessica specification

### Body transition rules
| Body state | Duration | Description | Entry Rules | Stimulus Rules |
| - | - | - | - | - |
| UPSWING | 5 frames | Jessica actively swings her katana upward; 3rd frame is active | {intent is UPSWING} when {body is IDLE or last frame of UPSWING} | hurtible; knockable; clashable |
| SIDECUT | 5 frames | Jessica actively swings her katana sideway; 3rd frame is active | {intent is SIDECUT} when {body is IDLE or last frame of SIDECUT} | hurtible; knockable; clashable |
| SLASH | 5 frames | Jessica actively swings her katana downward; 3rd frame is active | {intent is SLASH} when {body is IDLE or last frame of SLASH} | hurtible; knockable; clashable |
| BLOCK | 3 frames | Jessica actively blocks with her katana; 2nd frame is active | {intent is BLOCK} when {body is IDLE or last frame of BLOCK} | hurtible; knockable |
| CLASH | 4 frames | Jessica involuntarily bounces her katana back from clashing with opponent's weapon | the two players' attack hitboxes overlap | hurtible; knockable |
| HURT | 2 frames | Jessica involuntarily cringes from being hit | Jessica's body hit by opponent's attack hitbox | knockable |
| KNOCKED | 11 frames | Jessica bounces back from being critically hit | Jessica's body hit by opponent's attack hitbox at low health, or attack when opponent is Antoc in blocking | invincible |
| MOVE FORWARD / BACKWARD | n/a | Jessica walks forward or backward | {intent is DASH FORWARD or DASH BACKWARD} when body responds to locomotive intent | hurtible; knockable
| DASH FORWARD / BACKWARD | n/a | Jessica dashes forward or backward | {intent is DASH FORWARD or DASH BACKWARD} when body responds to locomotive intent | invincible |

### Stamina change
| Body state | Change | Note |
| - | - | - |
| No action | +20 | stamina replenishes per frame |
| Move forward | +20 | stamina replenishes per frame |
| Move backward | +20 | stamina replenishes per frame |
| Block | +10 | stamina replenishes per frame |
| Dash forward | -50 | .. |
| Dash backward | -50 | .. |
| (Jessica) Upswing | -100 | .. |
| (Jessica) Sidecut | -100 | .. |
| (Jessica) Slash | -100 | .. |
| (Antoc) Hori | -100 | .. |
| (Antoc) Vert | -100 | .. |

### Hitbox dimensions
TBD
`
const infoTag = <ReactMarkdown children={info} remarkPlugins={[remarkGfm]} />

const ContractInformation = ({
    title, onClose, open
}: ContractInformationProps) => {

  return (
    <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        open={open}
        onClose={onClose}
        hideBackdrop={true}
        disableEnforceFocus={true}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        slotProps={{
            root: { style: { width: '70%'} },
        }}
    >
      <DialogTitle sx={{backgroundColor: 'grey.100'}}>
        <div>
          {title}
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 0, right: 0 }}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers>
        {/* <div style={{width: '40rem', height: '30rem'}}>
          <List dense>
            <ListItemText primary={'Common stamina effets'}/>
              <List dense>
                <ListItemText sx={{pl: '1rem'}} primary={'Idle: +20'} />
                <ListItemText sx={{pl: '1rem'}} primary={'Move: +20'} />
                <ListItemText sx={{pl: '1rem'}} primary={'Block: +10'} />
                <ListItemText sx={{pl: '1rem'}} primary={'Dash: -50'} />
              </List>
          </List>
        </div> */}

        {infoTag}

      </DialogContent>

    </Dialog>
  );
};

export default ContractInformation;
