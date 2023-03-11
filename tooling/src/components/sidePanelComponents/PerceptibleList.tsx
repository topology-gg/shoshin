import React, {useState} from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ElementType, ConditionElement, Perceptible } from '../../types/Condition'

const PerceptibleList = ({
    disabled, perceptibles, conditionUnderEditIndex, handleUpdateCondition
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (event) => {
    if (event.target.id) {
      let perceptible = Perceptible[event.target.id.split('-')[1]]
      handleUpdateCondition(conditionUnderEditIndex, { value: perceptible, type: ElementType.Perceptible } as ConditionElement)
    }
    setAnchorEl(null)
  }

  return (
    <div>

        <Button
            id='perceptibles-button'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            variant="outlined"
            disabled={disabled}
            sx={{width:'3rem'}}
        >
            Pick
        </Button>

        <Menu
        id='perceptibles-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        >
            {perceptibles.map((p, i) => {
                return <MenuItem id={ `perceptible-${p}` } key={ `perceptible-${i}` } onClick={handleClose}>{p}</MenuItem>
            })}
        </Menu>

    </div>
  );
}

export default PerceptibleList;