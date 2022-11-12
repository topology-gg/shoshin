import { Add } from "@mui/icons-material";
import { InputBase } from "@mui/material";
import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { INSTRUCTION_ICON_MAP } from "../constants/constants";
import InstructionToken from "./InstructionToken";

const NewInstruction = ({
    onInsert,
    onKeyDown,
    onKeyUp,
    selected,
    onSelect,
    onBlur,
}) => {
    const inputRef = useRef<HTMLInputElement>();

    const [invalid, setInvalid] = useState<boolean>(false);

    const handleClick = () => {
        onSelect();
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const instruction = event.target.value;
        if (Object.keys(INSTRUCTION_ICON_MAP).includes(instruction)) {
            onInsert(instruction);
            setInvalid(false);
        } else {
            setInvalid(true);
        }
        // Reset the input
        inputRef.current.value = "";
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
        <InstructionToken
            onClick={handleClick}
            active={false}
            selected={selected}
            sx={{ borderColor: "info.main" }}
        >
            <InputBase
                inputRef={inputRef}
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                sx={{
                    bgcolor: invalid ? "error.main" : "transparent",
                    color: "secondary.contrastText",
                    transition: "ease-in-out .2s",
                }}
            />
            {!selected ? <Add color="info" fontSize="small" /> : null}
        </InstructionToken>
    );
};

export default NewInstruction;
