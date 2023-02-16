import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import { animated, useSpring } from "@react-spring/web";
import useMeasure from "react-use-measure";
import styles from "../../styles/StatusBar.module.css";
import "../../styles/StatusBar.module.css";
import { Grid } from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { color } from "@mui/system";

const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
        color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
        color: "#ff3d47",
    },
});

enum CustomColor {
    INTEGRITY = "integrity",
    STAMINA = "stamina",
}

interface statusBarProps {
    value: number;
    max: number;
    customColor?: string;
}
const IntegrityBar = (props: statusBarProps) => {
    let { value, max, customColor } = props;

    const [ref, { width }] = useMeasure();
    const springProps = useSpring({ width: value });

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
    let { value, max, customColor } = props;
    const [ref, { width }] = useMeasure();
    const springProps = useSpring({ width: value });



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
    integrity_0: number;
    integrity_1: number;
    stamina_0: number;
    stamina_1: number;
}

const StatusBarPanel = ({
    integrity_0,
    integrity_1,
    stamina_0,
    stamina_1,
}: StatusBarPanelProps) => {
    return (
        <div>
            <div className={styles.statusBarRow}>
                <IntegrityBar value={integrity_0} max={1000} />
                <IntegrityBar
                    value={integrity_1}
                    max={1000}
                    customColor={CustomColor.STAMINA}
                />
            </div>
            <div className={styles.statusBarRow}>
                <StaminaBar value={stamina_0} max={1000} />
                <StaminaBar
                    value={stamina_1}
                    max={1000}
                    customColor={CustomColor.STAMINA}
                />
            </div>
        </div>
    );
};

export default StatusBarPanel;
