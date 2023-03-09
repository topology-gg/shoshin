import { useCallback, useState } from 'react'
import { Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import ComboEditor from './ComboEditor';
import { DECISION_TREE_COMBO_AGENT, DEFENSIVE_AGENT, INITIAL_CONDITIONS, MENTAL_STATES_COMBO_AGENT, OFFENSIVE_AGENT } from '../constants/constants';
import Agent, { buildAgent } from '../types/Agent';


export const AdversarySelection = ({
  warning, adversary, setAdversary, setOpponent, onComboChange
}) => {
  const [_, setAnchorEl] = useState<null | HTMLElement>(null)
  const [editingCombo, setEditingCombo] = useState<number[]>([])

  const handleClose = (a: string) => {
      setAdversary(a)
      switch (a) {
        case 'offensive': {
          setOpponent(OFFENSIVE_AGENT)
          break
        }
        case 'defensive': {
          setOpponent(DEFENSIVE_AGENT)
          break
        }
      }
      setAnchorEl(null)
  }

  const handleComboChange = (combo) => {
    let agent: Agent = buildAgent(
      MENTAL_STATES_COMBO_AGENT,
      [editingCombo],
      DECISION_TREE_COMBO_AGENT,
      INITIAL_CONDITIONS,
      0,
      1
    );
    setOpponent(agent)
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
