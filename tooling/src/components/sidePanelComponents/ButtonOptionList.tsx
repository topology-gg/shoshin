import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// This is a generic component:
// - a button, which shows {buttonLabel} as label;
// - when clicked, a dropdown list shows, listing {options}, where each option either appears as-is, or as {optionLabel}-{index of option};
// - when an option is clicked, the list hides, and
const ButtonOptionList = ({
    buttonLabel,
    options,
    optionLabel = null,
    optionSelected,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        if (event.target.id) {
            optionSelected(options[event.target.id]);
        }
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="button-option-list-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="outlined"
            >
                {buttonLabel}
            </Button>

            <Menu
                id="button-option-list-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {options ? (
                    options.map((option, option_i) => {
                        return (
                            <MenuItem
                                id={`${option_i}`}
                                key={`button-option-list-menu-item-${option_i}`}
                                onClick={handleClose}
                            >
                                {optionLabel
                                    ? `${optionLabel}-${option_i}`
                                    : option}
                            </MenuItem>
                        );
                    })
                ) : (
                    <MenuItem
                        id={`empty`}
                        key={`button-option-list-menu-item-empty`}
                        // onClick={handleClose}
                        disabled={true}
                    >
                        no option available
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};

export default ButtonOptionList;
