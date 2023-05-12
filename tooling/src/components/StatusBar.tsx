import React from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import styles from "../../styles/StatusBar.module.css";
import "../../styles/StatusBar.module.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
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

    const BarHeight = 5;
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
                    height: BarHeight,
                    backgroundColor: "white",
                }}
                key={`status-bar-value-${i}`}
            ></div>
        );
    }

    // Reference
    // https://github.com/topology-gg/shoshin-tooling/pull/50
    // https://www.colorsexplained.com/shades-of-blue-color-names/ - Maya blue
    const CustomLinearProgress = styled(LinearProgress)(({ datatype }) => ({
        height: BarHeight,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: '#DDDDDD',
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor:'#73C2FB'
        },
    }));


    return (
        <div>
            <CustomLinearProgress
                datatype="stamina"
                variant="determinate"
                value={value / 10}
                sx = {{ width: 200 }}
            />
            {staminaBarValues}
        </div>
    );
};

export interface StatusBarPanelProps {
    integrity_0: number;
    integrity_1: number;
    stamina_0: number;
    stamina_1: number;
}

const StatusBarPanel = ({
    integrity_0,
    integrity_1,
    stamina_0,
    stamina_1
}: StatusBarPanelProps) => {

    return (
        <div>
            <div className={styles.statusBarRow}>
                <IntegrityBar value={integrity_0} />
                <IntegrityBar value={integrity_1} />
            </div>
            <div className={styles.statusBarRow} style={{height:'1rem'}}>
                <StaminaBar value={stamina_0} />
                <StaminaBar value={stamina_1} />
            </div>
        </div>
    );
};

export default StatusBarPanel;
