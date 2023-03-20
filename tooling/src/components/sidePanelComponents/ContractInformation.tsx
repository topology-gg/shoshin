import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { Close } from '@mui/icons-material';
import Draggable from 'react-draggable';
import Paper, { PaperProps } from '@mui/material/Paper';

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

const ContractInformation = ({
  title, onClose, open 
}: ContractInformationProps) => {

  return (
    <Dialog 
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
        <div style={{width: '40rem', height: '30rem'}}>
          <List dense>
            <ListItemText primary={'Common stamina effets'}/>
              <List dense>
                <ListItemText sx={{pl: '1rem'}} primary={'Idle: +20'} />
                <ListItemText sx={{pl: '1rem'}} primary={'Move: +20'} />
                <ListItemText sx={{pl: '1rem'}} primary={'Block: +10'} />
                <ListItemText sx={{pl: '1rem'}} primary={'Dash: -50'} />
              </List>
          </List>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractInformation;
