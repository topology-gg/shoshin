import { useState } from 'react'
import { Typography, Button } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useContext, useEffect } from "react";
import ComboEditor from './ComboEditor';
import { WASMContext } from "../context/WASM";


export const AdversarySelection = ({
  warning, adversary, setAdversary, onComboChange
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [editingCombo, setEditingCombo] = useState<number[]>([])

  const opened = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (a: string) => {
      setAdversary(a)
      setAnchorEl(null)
  }

  const handleComboChange = (combo) => {
    setEditingCombo(combo)
    onComboChange(combo)
  }

  let displayWarning = warning !== ''

  return (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '1.5rem',
        }}
    >
      <Button
          id={`initial-actions-menu-button`}
          variant="outlined"
          aria-controls={opened ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={opened ? 'true' : undefined}
          onClick={handleClick}
          sx={{
              marginTop: '1rem'
          }}
      >
          {/* <Typography variant='overline'>{(isDefensiveAdversary? 'Defensive': 'Offensive') + ' adversary'}</Typography> */}
          {(adversary === 'defensive'? 'Defensive': adversary === 'offensive'? 'Offensive': 'Combo') + ' adversary'}
      </Button>

      { displayWarning && <Typography variant="overline" color="red">{warning}</Typography> }

      {/* <Button id='constant' variant="outlined" onClick={handleAddElement}>Add</Button> */}
      <Menu
      id={'initial-actions-menu'}
      anchorEl={anchorEl}
      open={opened}
      onClose={handleClose}
      >
        <MenuItem key={ `defensive-adversary` } onClick={() => handleClose('defensive')}>Defensive adversary</MenuItem>
        <MenuItem key={ `offensive-adversary` } onClick={() => handleClose('offensive')}>Offensive adversary</MenuItem>
        <MenuItem key={ `combo-adversary` } onClick={() => handleClose('combo')}>Combo adversary</MenuItem>
      </Menu>
      
      { adversary === 'combo' && 
        <ComboEditor 
          editingCombo={editingCombo} 
          setEditingCombo={handleComboChange}
          characterIndex={1}
          selectedIndex={0}
          setSelectedIndex={() => {}}
          handleValidateCombo={() => {}}
          displayButton={false}
        ></ComboEditor>
      }
    </div>
  );
};
