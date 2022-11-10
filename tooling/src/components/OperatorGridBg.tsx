import React from "react";
import Operator, { OPERATOR_TYPES } from "../types/Operator";

import styles from "../../styles/OperatorGridBg.module.css";
import { DIM } from "../constants/constants";

// An arbitrary value - the svg is scaled to fit 100% its parent
const GRID_SIZE = 32;

const OperatorGridBg = ({ operators, highlighted }: { operators: Operator[], highlighted: boolean[] }) => {

    let opacityValues
    if (highlighted) {
        opacityValues = highlighted.map((v,_) => {
            return v ? 1.0 : 0.3
        })
    }
    console.log('opacityValues:', opacityValues)

    return (
        <div className={styles.gridWrapper}>
            <svg
                className={styles.grid}
                viewBox={`0 0 ${DIM * GRID_SIZE} ${DIM * GRID_SIZE}`}
            >
                {operators.map((operator, i) => (
                    <polyline
                        key={i}
                        points={operator.input
                            .concat(operator.output)
                            .map(
                                (grid) =>
                                    `${grid.x * GRID_SIZE + GRID_SIZE / 2},${
                                        grid.y * GRID_SIZE + GRID_SIZE / 2
                                    }`
                            )
                            .join(" ")}
                        fill="none"
                        stroke={operator.typ.color}
                        opacity={highlighted && (highlighted.length>0) ? opacityValues[i] : 0.3}
                        strokeWidth={GRID_SIZE * 0.95}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ))}
            </svg>
        </div>
    );
};

export default OperatorGridBg;
