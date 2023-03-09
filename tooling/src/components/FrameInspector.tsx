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

type FrameInspectorProps = {
    testJson: TestJson;
    animationFrame: number;
    onAdversaryEdit: () => void;
};

const FrameInspector = ({
    testJson,
    animationFrame,
    onAdversaryEdit,
}: FrameInspectorProps) => {

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
        <Grid container spacing={1}>
            {[frameLeft, frameRight].map((frame, i) => (
                <Grid item xs={6}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={1}>
                                    <b>{characterNames[i]}</b>
                                </TableCell>
                                <TableCell align="right" colSpan={2}>
                                    <Box sx={{ whiteSpace: "nowrap" }}>
                                        {frame === frameRight ? (
                                            <>
                                                P2
                                                <IconButton
                                                    disabled
                                                    size="small"
                                                    // onClick={onAdversaryEdit}
                                                >
                                                    <Person />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <>
                                                P1
                                                <IconButton
                                                    disabled
                                                    size="small"
                                                >
                                                    <Person />
                                                </IconButton>
                                            </>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>body_state</TableCell>
                                <TableCell align="right">
                                    {
                                        bodyStateNumberToName[
                                            characterNames[i]
                                        ][frame.body_state.state]
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    {frame.body_state.state}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    body_state.counter
                                </TableCell>
                                <TableCell align="right">
                                    {frame.body_state.counter}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    body_state.stamina
                                </TableCell>
                                <TableCell align="right">
                                    {frame.body_state.stamina}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    body_state.integrity
                                </TableCell>
                                <TableCell align="right">
                                    {frame.body_state.integrity}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    body_state.dir
                                </TableCell>
                                <TableCell align="right">
                                    {frame.body_state.dir}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    hitboxes.body.origin (x, y)
                                </TableCell>
                                <TableCell align="right">
                                    {frame.hitboxes.body.origin.x},{" "}
                                    {frame.hitboxes.body.origin.y}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    physics_state.vel_fp
                                </TableCell>
                                <TableCell align="right">
                                    {frame.physics_state.vel_fp.x},{" "}
                                    {frame.physics_state.vel_fp.y}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    physics_state.acc_fp
                                </TableCell>
                                <TableCell align="right">
                                    {frame.physics_state.acc_fp.x},{" "}
                                    {frame.physics_state.acc_fp.y}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
            ))}
        </Grid>
    );
};

export default FrameInspector;
