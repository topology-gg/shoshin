import { Person } from "@mui/icons-material";
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
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
import Agent from "../types/Agent";
import { KeywordMentalState, KeywordBodyState } from "./ui/Keyword";

type FrameInspectorProps = {
    p1: Agent;
    p2: Agent;
    testJson: TestJson;
    animationFrame: number;
};

const FrameInspector = ({
    p1,
    p2,
    testJson,
    animationFrame,
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
    const agentMentalStateNames = [
        p1.mentalStatesNames,
        p2.mentalStatesNames
    ]

    return (
        // <div style={{padding:'10px', paddingBottom:'20px', marginBottom:'16px', border:'1px solid #777', borderRadius:'20px'}}>
        <Grid container spacing={1}>
            {[frameLeft, frameRight].map((frame, player_index) => (
                <Grid item xs={6}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={1}>
                                    <b>{characterNames[player_index]}</b>
                                </TableCell>
                                <TableCell align="right" colSpan={2}>
                                    <Box sx={{ whiteSpace: "nowrap" }}>
                                        {frame === frameRight ? (
                                            <>
                                                P2
                                                <IconButton
                                                    disabled
                                                    size="small"
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
                                <TableCell colSpan={2}>
                                    <span style={{fontSize:'20px', marginRight:'8px'}}>&#129504;</span>
                                    Mental State
                                </TableCell>
                                <TableCell align="right">
                                    <KeywordMentalState
                                        text={agentMentalStateNames[player_index][frame.mental_state]}
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    <span style={{fontSize:'20px'}}>&#129336;</span> Body State
                                </TableCell>
                                <TableCell align="right">
                                    <KeywordBodyState
                                        text={bodyStateNumberToName[characterNames[player_index]][frame.body_state.state]}
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    Body Counter
                                </TableCell>
                                <TableCell align="right">
                                    {/* showing counter + 1 so that the body counter starts from 1 corresponding to 1st frame of the body state */}
                                    {frame.body_state.counter + 1}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    Stamina
                                </TableCell>
                                <TableCell align="right">
                                    {frame.body_state.stamina}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    HP
                                </TableCell>
                                <TableCell align="right">
                                    {frame.body_state.integrity}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    Direction
                                </TableCell>
                                <TableCell align="right">
                                    {frame.body_state.dir == 1 ? <EastIcon /> : <WestIcon />}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    Which Combo
                                </TableCell>
                                <TableCell align="right">
                                    {frame.combo.combo_index - 1}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    Which Action in Combo
                                </TableCell>
                                <TableCell align="right">
                                    {frame.combo.action_index - 1}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    Body Origin
                                </TableCell>
                                <TableCell align="right">
                                    ({frame.hitboxes.body.origin.x},{" "}
                                    {frame.hitboxes.body.origin.y})
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    Velocity
                                </TableCell>
                                <TableCell align="right">
                                    ({frame.physics_state.vel_fp.x},{" "}
                                    {frame.physics_state.vel_fp.y})
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    Acceleration
                                </TableCell>
                                <TableCell align="right">
                                    ({frame.physics_state.acc_fp.x},{" "}
                                    {frame.physics_state.acc_fp.y})
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </Grid>
            ))}
        </Grid>
        // </div>
    );
};

export default FrameInspector;
