import React, { useState } from "react";
import Grid from "../types/Grid";
import { isGridOOB } from "../helpers/gridHelpers";
import styles from "../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import { PROGRAM_SIZE_MAX } from "../constants/constants";
import { Draggable } from "react-beautiful-dnd";
import Unit from "../../pages/unit"
import UnitState, {
    BgStatus,
    BorderStatus,
    UnitText,
} from "../types/UnitState";

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
}: MechInputProps) => {
    const { t } = useTranslation();

    const programLength = program.split(",").length;
    const currentInstructionIndex = pc % programLength;

    const NORMAL_STYLE = { width: "700px" };
    const INVALID_STYLE = {
        ...NORMAL_STYLE,
        backgroundColor: "#FFCBCB",
        color: "#999999",
    };
    const [programStyle, setProgramStyle] = useState(NORMAL_STYLE);

    return (
        <Draggable draggableId={mechIndex.toString()} index={mechIndex}>
            {(provided, snapshot) => (
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
                >
                    <div style={{marginLeft:'1rem'}}>
                        <Unit
                            state={{
                                bg_status: BgStatus.EMPTY,
                                border_status: null,
                                unit_text: UnitText.EMPTY,
                                unit_id: null,
                            }}
                            handleMouseOut={() => {}}
                            handleMouseOver={() => {}}
                            mechHighlight = {false}
                            isSmall={true}
                        />
                    </div>

                    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
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
                        style={{ width: "30px", textAlign: "center" }}
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
                            textAlign: "center",
                            marginRight: "0.8rem",
                        }}
                        disabled={disabled}
                    ></input>

                    <div className={styles.programWrapper}>
                        <div
                            className={styles.instructionBox}
                            style={{ left: `${currentInstructionIndex}rem` }}
                        />
                        <input
                            className={styles.program}
                            onChange={(event) => {
                                const program = event.target.value;
                                onProgramChange(mechIndex, program);
                                const instructions = program.split(
                                    ","
                                ) as string[];
                                if (instructions.length > PROGRAM_SIZE_MAX) {
                                    setProgramStyle((prev) => INVALID_STYLE);
                                } else {
                                    setProgramStyle((prev) => NORMAL_STYLE);
                                }
                            }}
                            defaultValue={program}
                            value={program}
                            style={programStyle}
                            disabled={disabled}
                        ></input>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default MechInput;
