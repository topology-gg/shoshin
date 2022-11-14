import { InputBase } from "@mui/material";
import React, {
    KeyboardEventHandler,
    MouseEvent,
    useEffect,
    useRef,
} from "react";
import { INSTRUCTION_ICON_MAP } from "../constants/constants";
import InstructionToken from "./InstructionToken";

const SingleInstruction = ({
    instruction,
    active,
    onSelect,
    onBlur,
    onKeyUp,
    selected,
}: {
    instruction: string;
    active: boolean;
    onSelect: () => void;
    onBlur: () => void;
    onKeyUp: KeyboardEventHandler;
    selected: boolean;
}) => {
    const inputRef = useRef<HTMLInputElement>();
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        onSelect();
    };

    useEffect(() => {
        if (selected) {
            inputRef.current.focus();
        }
    }, [selected]);

    return (
        <>
            <InstructionToken
                onClick={handleClick}
                active={active}
                selected={selected}
            >
                <i className="material-icons" style={{ fontSize: "1rem" }}>
                    {INSTRUCTION_ICON_MAP[instruction.toLowerCase()]}
                </i>
                <InputBase
                    inputRef={inputRef}
                    type="text"
                    onBlur={onBlur}
                    onKeyUp={onKeyUp}
                    sx={{ opacity: "0.001", pointerEvents: "none" }}
                />
            </InstructionToken>
        </>
    );
};

export default SingleInstruction;
