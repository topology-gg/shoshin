import { Person } from "@mui/icons-material";
import {
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { bodyStateNumberToName } from "../constants/constants";
import { TestJson } from "../types/Frame";

type FrameDecisionPathViewerProps = {
    testJson: TestJson;
    animationFrame: number;
};

const FrameDecisionPathViewer = ({
    testJson,
    animationFrame,
}: FrameDecisionPathViewerProps) => {

    const characterLeftType = testJson?.agent_0.type
    const characterRightType = testJson?.agent_1.type
    const frameLeft = testJson?.agent_0.frames[animationFrame]
    const frameRight= testJson?.agent_1.frames[animationFrame]

    if (!frameLeft || !frameRight) return;

    const frames = [frameLeft, frameRight];
    const characterNames = [
        characterLeftType === 0 ? "jessica" : "antoc",
        characterRightType === 0 ? "jessica" : "antoc",
    ];

    return (
        <div style={{padding:'10px', paddingBottom:'20px', border:'1px solid #777', borderRadius:'20px'}}>
        <Grid container spacing={1}>
            {[frameLeft, frameRight].map((frame, i) => (
                <Grid item xs={6}>
                    <p>haha</p>
                </Grid>
            ))}
        </Grid>
        </div>
    );
};

export default FrameDecisionPathViewer;
