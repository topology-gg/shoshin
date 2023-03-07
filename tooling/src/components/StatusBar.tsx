import React from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import styles from "../../styles/StatusBar.module.css";
import "../../styles/StatusBar.module.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import LinearProgress from "@mui/material/LinearProgress";
import { TestJson } from "../types/Frame";

const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
        color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
        color: "#ff3d47",
    },
});

interface statusBarProps {
    value: number;
}
const IntegrityBar = (props: statusBarProps) => {
    let { value } = props;

    return (
        <div>
            <StyledRating
                name="customized-color"
                readOnly={true}
                getLabelText={(value: number) =>
                    `${value} Heart${value !== 1 ? "s" : ""}`
                }
                precision={0.5}
                value={value / 200}
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
            />
        </div>
    );
};

const StaminaBar = (props: statusBarProps) => {
    let { value } = props;

    let staminaBarValues = [];

    for (let i = 1; i < 10; i++) {
        staminaBarValues.push(
            <div
                style={{
                    position: "relative",
                    top: -5 * i,
                    left: 20 * i,
                    zIndex: 200,
                    width: 2,
                    height: 5,
                    backgroundColor: "white",
                }}
                key={`status-bar-value-${i}`}
            ></div>
        );
    }

    return (
        <div>
            <LinearProgress
                variant="determinate"
                value={value / 10}
                sx={{
                    width: 200,
                }}
            />
            {staminaBarValues}
        </div>
    );
};

interface StatusBarPanelProps {
    // integrity_0: number;
    // integrity_1: number;
    // stamina_0: number;
    // stamina_1: number;
    testJson: TestJson;
    animationFrame: number;
}

const StatusBarPanel = ({
    testJson,
    animationFrame,
}: StatusBarPanelProps) => {

    const integrity_0 = testJson ? testJson.agent_0.frames[animationFrame].body_state.integrity : 0
    const integrity_1 = testJson ? testJson.agent_1.frames[animationFrame].body_state.integrity : 0
    const stamina_0 = testJson ? testJson.agent_0.frames[animationFrame].body_state.stamina : 0
    const stamina_1 = testJson ? testJson.agent_1.frames[animationFrame].body_state.stamina : 0

    return (
        <div>
            <div className={styles.statusBarRow}>
                <IntegrityBar value={integrity_0} />
                <IntegrityBar value={integrity_1} />
            </div>
            <div className={styles.statusBarRow}>
                <StaminaBar value={stamina_0} />
                <StaminaBar value={stamina_1} />
            </div>
        </div>
    );
};

export default StatusBarPanel;
