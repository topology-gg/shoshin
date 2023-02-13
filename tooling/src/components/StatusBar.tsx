import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import { animated, useSpring } from "@react-spring/web";
import useMeasure from "react-use-measure";
import styles from "../../styles/StatusBar.module.css";
import "../../styles/StatusBar.module.css";
import { Grid } from "@mui/material";

enum CustomColor{
    INTEGRITY = "integrity",
    STAMINA = "stamina"
}
const StatusBar = (value, max, customColor ?: CustomColor) => {
    const [ref, { width }] = useMeasure();
    const props = useSpring({ width: value });

    return (
        <div>
            <div className={styles.main} >
                <animated.div className={`${styles.fill}`} style={props}/>
                <animated.div className={styles.content}>      
                </animated.div>
                
            </div>
        </div>
    );
};

interface StatusBarPanelProps {
    integrity_0: any;
    integrity_1: any;
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
                <StatusBar value={integrity_0} max={1000}/>
                <StatusBar value={integrity_1} max={1000}  customColor={CustomColor.STAMINA} />
            </div>
            <div className={styles.statusBarRow}>
                <StatusBar value={stamina_0} max={1000} />
                <StatusBar value={stamina_1} max={1000}  customColor={CustomColor.STAMINA}/>
            </div>
        </div>
    );
};

export default StatusBarPanel;
