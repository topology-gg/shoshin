import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import React from "react";
import { bodyStateNumberToName } from "../constants/constants";
import { Frame } from "../types/Frame";

type FrameInspectorProps = {
    characterLeftType: number;
    characterRightType: number;
    frameLeft: Frame;
    frameRight: Frame;
};

const FrameInspector = ({
    characterLeftType,
    characterRightType,
    frameLeft,
    frameRight,
}: FrameInspectorProps) => {
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
                                <TableCell colSpan={3}>
                                    <b>{characterNames[i]}</b>
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
                                        ][frames[i].body_state.state]
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    {frames[i].body_state.state}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    body_state.counter
                                </TableCell>
                                <TableCell align="right">
                                    {frames[i].body_state.counter}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    body_state.stamina
                                </TableCell>
                                <TableCell align="right">
                                    {frames[i].body_state.stamina}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    body_state.integrity
                                </TableCell>
                                <TableCell align="right">
                                    {frames[i].body_state.integrity}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    body_state.dir
                                </TableCell>
                                <TableCell align="right">
                                    {frames[i].body_state.dir}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    hitboxes.body.origin (x, y)
                                </TableCell>
                                <TableCell align="right">
                                    {frames[i].hitboxes.body.origin.x},{" "}
                                    {frames[i].hitboxes.body.origin.y}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    physics_state.vel_fp
                                </TableCell>
                                <TableCell align="right">
                                    {frames[i].physics_state.vel_fp.x},{" "}
                                    {frames[i].physics_state.vel_fp.y}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    physics_state.acc_fp
                                </TableCell>
                                <TableCell align="right">
                                    {frames[i].physics_state.acc_fp.x},{" "}
                                    {frames[i].physics_state.acc_fp.y}
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
