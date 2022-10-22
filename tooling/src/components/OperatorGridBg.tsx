import React from "react";
import Operator, { OPERATOR_TYPES } from "../types/Operator";

import styles from "../../styles/OperatorGridBg.module.css";
import { DIM } from "../constants/constants";

// An arbitrary value - the svg is scaled to fit 100% its parent
const GRID_SIZE = 32;

const OperatorGridBg = ({ operators }: { operators: Operator[] }) => {
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
