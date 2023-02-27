import { useState } from 'react'
import { Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import ComboEditor from './ComboEditor';


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
      <ToggleButtonGroup value={adversary} exclusive onChange={(e, value) => handleClose(value)}>
        <ToggleButton value="defensive">Defensive</ToggleButton>
        <ToggleButton value="offensive">Offensive</ToggleButton>
        <ToggleButton value="combo">Combo</ToggleButton>
      </ToggleButtonGroup>

      { displayWarning && <Typography variant="overline" color="red">{warning}</Typography> }

      {/* <Button id='constant' variant="outlined" onClick={handleAddElement}>Add</Button> */}
      
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
