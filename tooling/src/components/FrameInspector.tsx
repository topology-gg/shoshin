import { Person } from '@mui/icons-material';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import {
    Button,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import {
    CHARACTERS_ACTIONS,
    DT_FP,
    SCALE_FP,
    bodyStateNumberToName,
    getIntentNameByCharacterTypeAndNumber,
} from '../constants/constants';
import { TestJson } from '../types/Frame';
import Agent from '../types/Agent';
import { KeywordMentalState, KeywordBodyState } from './ui/Keyword';

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
    const characterLeftType = testJson?.agent_0.type;
    const characterRightType = testJson?.agent_1.type;
    const frameLeft = testJson?.agent_0.frames[animationFrame];
    const frameRight = testJson?.agent_1.frames[animationFrame];

    if (!frameLeft || !frameRight) return;

    const frames = [frameLeft, frameRight];
    const characterNames = [
        characterLeftType === 0 ? 'jessica' : 'antoc',
        characterRightType === 0 ? 'jessica' : 'antoc',
    ];
    const agentMentalStateNames = [p1.mentalStatesNames, p2.mentalStatesNames];
    const combos = [p1.combos, p2.combos];

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
                                    <Box sx={{ whiteSpace: 'nowrap' }}>
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
                                    <span
                                        style={{
                                            fontSize: '20px',
                                            marginRight: '8px',
                                        }}
                                    >
                                        &#129504;
                                    </span>
                                    Mental State
                                </TableCell>
                                <TableCell align="right">
                                    <KeywordMentalState
                                        text={
                                            agentMentalStateNames[player_index][
                                                frame.mental_state
                                            ]
                                        }
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    <span
                                        style={{
                                            fontSize: '20px',
                                            marginLeft: '1px',
                                            marginRight: '1px',
                                        }}
                                    >
                                        &#127841;
                                    </span>
                                    Combo
                                </TableCell>
                                <TableCell align="right">
                                    {frame.combo.combo_index == 0 ? (
                                        'n/a'
                                    ) : (
                                        <Tooltip
                                            placement={'left-start'}
                                            title={combos[player_index][
                                                frame.combo.combo_index - 1
                                            ]?.map((num, num_i) => {
                                                if (
                                                    num_i ==
                                                    frame.combo.action_index - 1
                                                ) {
                                                    return (
                                                        <div
                                                            style={{
                                                                border: '1px solid #333333',
                                                                padding: '4px',
                                                                borderRadius:
                                                                    '4px',
                                                                margin: '1px',
                                                                backgroundColor:
                                                                    '#FD3A4ACC',
                                                            }}
                                                        >
                                                            {num_i}.
                                                            {
                                                                CHARACTERS_ACTIONS[
                                                                    player_index ==
                                                                    0
                                                                        ? characterLeftType
                                                                        : characterRightType
                                                                ][num]
                                                            }
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div
                                                            style={{
                                                                border: '1px solid #333333',
                                                                padding: '4px',
                                                                borderRadius:
                                                                    '4px',
                                                                margin: '1px',
                                                            }}
                                                        >
                                                            {num_i}.
                                                            {
                                                                CHARACTERS_ACTIONS[
                                                                    player_index ==
                                                                    0
                                                                        ? characterLeftType
                                                                        : characterRightType
                                                                ][num]
                                                            }
                                                        </div>
                                                    );
                                                }
                                            })}
                                        >
                                            <Button
                                                variant="text"
                                                size={'small'}
                                                style={{
                                                    backgroundColor:
                                                        '#FD3A4ACC',
                                                }}
                                            >
                                                Combo {frame.combo.combo_index - 1}
                                                {/* combo index == 0 signifies current frame is running with atomic intent instead of combo */}
                                            </Button>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    <span
                                        style={{
                                            fontSize: '20px',
                                            marginRight: '8px',
                                        }}
                                    >
                                        &#129354;
                                    </span>
                                    Intent
                                </TableCell>
                                <TableCell align="right">
                                    {getIntentNameByCharacterTypeAndNumber(
                                        characterNames[player_index],
                                        frame.action
                                    )}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>
                                    <span style={{ fontSize: '20px' }}>
                                        &#129336;
                                    </span>{' '}
                                    Body State
                                </TableCell>
                                <TableCell align="right">
                                    <KeywordBodyState
                                        text={
                                            bodyStateNumberToName[
                                                characterNames[player_index]
                                            ][frame.body_state.state]
                                        }
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>Body Counter</TableCell>
                                <TableCell align="right">
                                    {/* showing counter + 1 so that the body counter starts from 1 corresponding to 1st frame of the body state */}
                                    {frame.body_state.counter + 1}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>Stamina</TableCell>
                                <TableCell align="right">
                                    {frame.body_state.stamina}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>HP</TableCell>
                                <TableCell align="right">
                                    {frame.body_state.integrity}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>Direction</TableCell>
                                <TableCell align="right">
                                    {frame.body_state.dir == 1 ? (
                                        <EastIcon />
                                    ) : (
                                        <WestIcon />
                                    )}
                                </TableCell>
                            </TableRow>

                            {/* <TableRow>
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
                            </TableRow> */}

                            <TableRow>
                                <TableCell colSpan={2}>X position</TableCell>
                                <TableCell align="right">
                                    {/* ({frame.hitboxes.body.origin.x},{" "}
                                    {frame.hitboxes.body.origin.y}) */}
                                    {frame.hitboxes.body.origin.x}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2}>Δ(X position)</TableCell>
                                <TableCell align="right">
                                    {/* ({frame.physics_state.vel_fp.x / SCALE_FP * (DT_FP / SCALE_FP)},{" "}
                                    {frame.physics_state.vel_fp.y / SCALE_FP * (DT_FP / SCALE_FP)})*/}
                                    {(frame.physics_state.vel_fp.x / SCALE_FP) *
                                        (DT_FP / SCALE_FP)}
                                </TableCell>
                            </TableRow>

                            {/* <TableRow>
                                <TableCell colSpan={2}>
                                    Acceleration * DT
                                </TableCell>
                                <TableCell align="right">
                                    ({frame.physics_state.acc_fp.x / SCALE_FP},{" "}
                                    {frame.physics_state.acc_fp.y / SCALE_FP})
                                </TableCell>
                            </TableRow> */}
                        </TableBody>
                    </Table>
                </Grid>
            ))}
        </Grid>
        // </div>
    );
};

export default FrameInspector;
