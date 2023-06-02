import { Add } from '@mui/icons-material';
import { InputBase } from '@mui/material';
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { CHARACTERS_ACTIONS } from '../../constants/constants';
import ActionToken from './ActionToken';

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

    const handleClick = () => {
        if (disabled) return;
        onSelect();
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const action = event.target.value;
        if (Object.keys(CHARACTERS_ACTIONS[characterIndex]).includes(action)) {
            onInsert(action);
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
