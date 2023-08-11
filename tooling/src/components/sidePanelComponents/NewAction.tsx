import { Add } from '@mui/icons-material';
import { InputBase } from '@mui/material';
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { CHARACTERS_ACTION_KEYBINDINGS } from '../../constants/constants';
import ActionToken from './ActionToken';
import { CHARACTERS_ACTIONS } from '../../types/Action';

const NewAction = ({
    disabled,
    onInsert,
    onKeyDown,
    selected,
    onSelect,
    onBlur,
    characterIndex,
}) => {
    const inputRef = useRef<HTMLInputElement>();

    const [invalid, setInvalid] = useState<boolean>(false);

    const keybindings = CHARACTERS_ACTION_KEYBINDINGS[characterIndex];
    const actions = CHARACTERS_ACTIONS[characterIndex];

    const handleClick = () => {
        if (disabled) return;
        onSelect();
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const key = event.target.value.toUpperCase();

        //LOWER CASE
        if (keybindings[key]) {
            onInsert(actions[keybindings[key]]);
            setInvalid(false);
        } else {
            setInvalid(true);
        }
        // Reset the input
        inputRef.current.value = '';
    };

    const handleBlur = () => {
        onBlur();
    };

    useEffect(() => {
        setInvalid(false);
        if (selected) {
            inputRef?.current.focus();
        } else {
            inputRef?.current.blur();
        }
    }, [selected]);

    return (
        <ActionToken
            onClick={handleClick}
            selected={selected}
            disabled={disabled}
        >
            <InputBase
                inputRef={inputRef}
                type="text"
                onChange={handleChange}
                onKeyDown={onKeyDown}
                onBlur={handleBlur}
                sx={{
                    bgcolor: invalid ? 'error.main' : 'transparent',
                    color: 'secondary.contrastText',
                    transition: 'ease-in-out .2s',
                }}
            />
            {!selected ? <Add color="info" fontSize="small" /> : null}
        </ActionToken>
    );
};

export default NewAction;
