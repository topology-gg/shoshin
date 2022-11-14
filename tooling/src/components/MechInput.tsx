import React, { KeyboardEventHandler, useState } from "react";
import Grid from "../types/Grid";
import styles from "../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import { INSTRUCTION_ICON_MAP, PROGRAM_SIZE_MAX } from "../constants/constants";
import { Draggable } from "react-beautiful-dnd";
import Unit from "../../pages/unit";
import { BgStatus, UnitText } from "../types/UnitState";
import SingleInstruction from "./SingleInstruction";
import NewInstruction from "./NewInstruction";

interface MechInputProps {
    mechIndex: number;
    position: Grid;
    program: string;
    pc: number;
    onPositionChange: (mechIndex: number, position: Grid) => void;
    onProgramChange: (mechIndex: number, program: string) => void;
    disabled: boolean;
    handleMouseOver: () => void;
    handleMouseOut: () => void;
    handleKeyDown: (event) => void;
    handleKeyUp: (event) => void;
    unitBgStatus: BgStatus;
}

const MechInput = ({
    mechIndex,
    position,
    program,
    pc,
    onPositionChange,
    onProgramChange,
    disabled,
    handleMouseOver,
    handleMouseOut,
    handleKeyDown: onKeyDown,
    handleKeyUp,
    unitBgStatus,
}: MechInputProps) => {
    const { t } = useTranslation();

    const instructions: string[] = program.split(",");
    const programLength = instructions.length;
    const currentInstructionIndex = pc % programLength;

    const NORMAL_STYLE = { width: "700px" };
    const INVALID_STYLE = {
        ...NORMAL_STYLE,
        backgroundColor: "#FFCBCB",
        color: "#999999",
    };
    const [programStyle, setProgramStyle] = useState(NORMAL_STYLE);
    const [selectedInstructionIndex, setSelectedInstructionIndex] =
        useState<number>(null);
    const [selectedNewInstruction, setSelectedNewInstruction] =
        useState<boolean>(false);

    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (event.code === "Backspace") {
            // Backspace - Remove last instruction
            const newProgram = instructions.slice(0, -1);
            onProgramChange(mechIndex, newProgram.join(","));
        } else {
            onKeyDown(event);
        }
    };

    const handleInsertInstruction = (instruction) => {
        const instructions = program.split(",") as string[];
        if (instructions.length > PROGRAM_SIZE_MAX) {
            setProgramStyle((prev) => INVALID_STYLE);
        } else {
            setProgramStyle((prev) => NORMAL_STYLE);
            const newProgram = program.concat(`,${instruction}`);
            onProgramChange(mechIndex, newProgram);
        }
    };

    const handleChangeInstruction: KeyboardEventHandler = (event) => {
        const instruction = event.key.toLowerCase();
        if (["Backspace", "Delete"].includes(event.key)) {
            // Remove instruction at selected index
            const newProgram = [
                ...instructions.slice(0, selectedInstructionIndex),
                ...instructions.slice(selectedInstructionIndex + 1),
            ];
            onProgramChange(mechIndex, newProgram.join(","));
            setSelectedInstructionIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (event.key === "ArrowLeft") {
            setSelectedInstructionIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (event.key === "ArrowRight") {
            setSelectedInstructionIndex((prev) =>
                prev < instructions.length - 1 ? prev + 1 : prev
            );
        } else if (Object.keys(INSTRUCTION_ICON_MAP).includes(instruction)) {
            const newInstructions = [...instructions];
            newInstructions[selectedInstructionIndex] = instruction;
            onProgramChange(mechIndex, newInstructions.join(","));
        }
    };

    return (
        <Draggable draggableId={mechIndex.toString()} index={mechIndex}>
            {(provided, _snapshot) => (
                <div
                    ref={provided.innerRef}
                    key={`input-row-${mechIndex}`}
                    className={styles.input_row}
                    onMouseOver={() => {
                        handleMouseOver();
                    }}
                    onMouseOut={() => {
                        handleMouseOut();
                    }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{marginBottom:'0.2rem', alignItems:'center'}}
                >
                    <div style={{ marginLeft: "1rem" }}>
                        <Unit
                            state={{
                                bg_status: unitBgStatus,
                                border_status: null,
                                unit_text: UnitText.EMPTY,
                                unit_id: null,
                            }}
                            handleMouseOut={() => {}}
                            handleMouseOver={() => {}}
                            mechHighlight={false}
                            isSmall={true}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <p
                            style={{
                                margin: "0 1rem 0 1rem",
                                width: "2.5rem",
                            }}
                        >
                            {t("mech")}
                            {mechIndex}
                        </p>
                    </div>

                    <input
                        className={styles.program}
                        onChange={(event) => {
                            if (isNaN(parseInt(event.target.value))) return;
                            onPositionChange(mechIndex, {
                                ...position,
                                x: parseInt(event.target.value),
                            });
                        }}
                        defaultValue={position.x}
                        value={position.x}
                        style={{
                            width: "30px",
                            height: "25px",
                            textAlign: "center",
                            border:"1px solid #CCCCCC",
                            borderRadius:'10px 0 0 10px'
                        }}
                        disabled={disabled}
                    ></input>

                    <input
                        className={styles.program}
                        onChange={(event) => {
                            if (isNaN(parseInt(event.target.value))) return;
                            onPositionChange(mechIndex, {
                                ...position,
                                y: parseInt(event.target.value),
                            });
                        }}
                        defaultValue={position.y}
                        value={position.y}
                        style={{
                            width: "30px",
                            height: '25px',
                            textAlign: "center",
                            marginRight: "0.8rem",
                            border:"1px solid #CCCCCC",
                            borderLeft:'0px',
                            borderRadius:'0 10px 10px 0',
                        }}
                        disabled={disabled}
                    ></input>

                    <div className={styles.programWrapper} style={{height:'25px'}}>
                        {instructions.map((instruction, index) => (
                            <SingleInstruction
                                instruction={instruction}
                                active={currentInstructionIndex === index}
                                selected={selectedInstructionIndex === index}
                                onSelect={() => {
                                    setSelectedInstructionIndex(index);
                                    setSelectedNewInstruction(false);
                                }}
                                onBlur={() =>
                                    setSelectedInstructionIndex((prev) =>
                                        prev === index ? null : prev
                                    )
                                }
                                onKeyUp={handleChangeInstruction}
                            />
                        ))}
                        <NewInstruction
                            onInsert={handleInsertInstruction}
                            onSelect={() => {
                                setSelectedInstructionIndex(null);
                                setSelectedNewInstruction(true);
                            }}
                            onBlur={() => setSelectedNewInstruction(false)}
                            selected={selectedNewInstruction}
                            onKeyDown={handleKeyDown}
                            onKeyUp={handleKeyUp}
                        />
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default MechInput;
