import React, {useState} from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ElementType, FunctionElement, Perceptible } from '../types/Function'

const BasicMenu = ({ perceptibles, functionsIndex, handleUpdateGeneralFunction, disabled }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (event) => {
    if (event.target.id) {
      let perceptible = Perceptible[event.target.id.split('-')[1]]
      handleUpdateGeneralFunction(functionsIndex, { value: perceptible, type: ElementType.Perceptible } as FunctionElement)
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
      >
        Perceptibles List
      </Button>
      <Menu
        id='perceptibles-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {perceptibles.map((p, i) => {
          return <MenuItem id={ `perceptible-${p}` } key={ `perceptible-${i}` } onClick={handleClose} disabled={disabled} >{p}</MenuItem>
        })}
      </Menu>
    </div>
  );
}

export default BasicMenu;