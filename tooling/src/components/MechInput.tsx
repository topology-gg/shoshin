import React, { useState } from "react";
import Grid from "../types/Grid";
import { isGridOOB } from '../helpers/gridHelpers';
import styles from "../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import { PROGRAM_SIZE_MAX } from '../constants/constants';

interface MechInputProps {
    mechIndex: number;
    position: Grid;
    program: string;
    pc: number;
    onPositionChange: (mechIndex: number, position: Grid) => void;
    onProgramChange: (mechIndex: number, program: string) => void;
    disabled: boolean
}

const MechInput = ({
    mechIndex,
    position,
    program,
    pc,
    onPositionChange,
    onProgramChange,
    disabled
}: MechInputProps) => {

    const { t } = useTranslation();

    const programLength = program.split(",").length;
    const currentInstructionIndex = pc % programLength;

    const NORMAL_STYLE = { width: "700px" }
    const INVALID_STYLE = {...NORMAL_STYLE, backgroundColor:'#FFCBCB', color:'#999999'}
    const [style, setStyle] = useState(NORMAL_STYLE);

    return (
        <div key={`input-row-${mechIndex}`} className={styles.input_row}>
            <p
                style={{
                    margin: "0 10px 0 0",
                    verticalAlign: "middle",
                    height: "20px",
                    lineHeight: "20px",
                    width: '2.5rem'
                }}
            >{t("mech")}{mechIndex}</p>
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
                style={{ width: "30px", textAlign: "center" }}
                disabled = {disabled}
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
                style={{ width: "30px", textAlign: "center", marginRight: '0.8rem' }}
                disabled = {disabled}
            ></input>

            <div className={styles.programWrapper}>
                <div
                    className={styles.instructionBox}
                    style={{ left: `${currentInstructionIndex}rem` }}
                />
                <input
                    className={styles.program}
                    onChange={(event) => {
                        const program = event.target.value
                        onProgramChange(mechIndex, program);
                        const instructions = program.split(',') as string[]
                        if (instructions.length > PROGRAM_SIZE_MAX) {
                            setStyle(prev => INVALID_STYLE)
                        }
                        else {
                            setStyle(prev => NORMAL_STYLE)
                        }
                    }}
                    defaultValue={program}
                    style={style}
                    disabled = {disabled}
                ></input>
            </div>
        </div>
    );
};

export default MechInput;
