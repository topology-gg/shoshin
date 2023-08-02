import React, { useMemo } from 'react';
import {
    Box,
    Button,
    Chip,
    FormControlLabel,
    Switch,
    Typography,
} from '@mui/material';
import {
    FastForward,
    FastRewind,
    Pause,
    PlayArrow,
    Stop,
} from '@mui/icons-material';
import Slider from '@mui/material/Slider';
import { Frame } from '../types/Frame';
import { BodystatesAntoc, BodystatesJessica } from '../types/Condition';
import Timeline from './ui/Timeline';
import EventSymbol from './ui/EventSymbol';
import SubmitMindButton from './SimulationScene/MainSceneSubmit';

// Calculate key events to be displayed along the timeline slider
function findFrameNumbersAtHurt(frames: Frame[]) {
    if (!frames) return;
    // find the frame number at which the agent is at the first frame (counter == 0) for hurt state (currently need to iterate over all character types)
    // and record that frame number minus one, which is the frame number where the agent is hurt by opponent
    let frameNumbers = [];
    frames.forEach((frame, frame_i) => {
        if (
            (frame.body_state.state == BodystatesAntoc.Hurt ||
                frame.body_state.state == BodystatesJessica.Hurt) &&
            frame.body_state.counter == 0
        ) {
            frameNumbers.push(frame_i);
        }
    });
    return frameNumbers;
}

function findFrameNumbersAtKnocked(frames: Frame[]) {
    if (!frames) return;
    // find the frame number at which the agent is at the first frame (counter == 0) for hurt state (currently need to iterate over all character types)
    // and record that frame number minus one, which is the frame number where the agent is knocked by opponent
    let frameNumbers = [];
    frames.forEach((frame, frame_i) => {
        if (
            (frame.body_state.state == BodystatesAntoc.Knocked ||
                frame.body_state.state == BodystatesJessica.Knocked) &&
            frame.body_state.counter == 0
        ) {
            frameNumbers.push(frame_i);
        }
    });
    return frameNumbers;
}

function findFrameNumbersAtLaunched(frames: Frame[]) {
    if (!frames) return;
    // find the frame number at which the agent is at the first frame (counter == 0) for hurt state (currently need to iterate over all character types)
    // and record that frame number minus one, which is the frame number where the agent is knocked by opponent
    let frameNumbers = [];
    console.log('frames', frames);
    frames.forEach((frame, frame_i) => {
        if (
            (frame.body_state.state == BodystatesAntoc.Launched ||
                frame.body_state.state == BodystatesJessica.Launched) &&
            frame.body_state.counter == 0
        ) {
            frameNumbers.push(frame_i);
        }
    });
    return frameNumbers;
}

const MidScreenControl = ({
    runnable,
    playOnly,
    testJsonAvailable,
    testJson,
    animationFrame,
    n_cycles,
    animationState,
    handleClick,
    handleSlideChange,
    checkedShowDebugInfo,
    handleChangeDebugInfo,
    player,
}) => {
    const BLANK_COLOR = 'rgba(242, 242, 242, 0.8)';

    const agent_0_frames = testJson?.agent_0.frames;
    const agent_1_frames = testJson?.agent_1.frames;

    const marksP1 = useMemo(
        () => [
            ...(findFrameNumbersAtHurt(agent_0_frames)?.map((f) => ({
                label: (
                    <EventSymbol type="hurt" active={animationFrame === f} />
                ),
                value: f,
            })) || []),
            ...(findFrameNumbersAtKnocked(agent_0_frames)?.map((f) => ({
                label: (
                    <EventSymbol type="knocked" active={animationFrame === f} />
                ),
                value: f,
            })) || []),
            ...(findFrameNumbersAtLaunched(agent_0_frames)?.map((f) => ({
                label: (
                    <EventSymbol
                        type="launched"
                        active={animationFrame === f}
                    />
                ),
                value: f,
            })) || []),
        ],
        [agent_0_frames, animationFrame]
    );
    const marksP2 = useMemo(
        () => [
            ...(findFrameNumbersAtHurt(agent_1_frames)?.map((f) => ({
                label: (
                    <EventSymbol type="hurt" active={animationFrame === f} />
                ),
                value: f,
            })) || []),
            ...(findFrameNumbersAtKnocked(agent_1_frames)?.map((f) => ({
                label: (
                    <EventSymbol type="knocked" active={animationFrame === f} />
                ),
                value: f,
            })) || []),
            ...(findFrameNumbersAtLaunched(agent_1_frames)?.map((f) => ({
                label: (
                    <EventSymbol
                        type="launched"
                        active={animationFrame === f}
                    />
                ),
                value: f,
            })) || []),
        ],
        [agent_1_frames, animationFrame]
    );

    console.log('player', player);
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: BLANK_COLOR,
                p: 2,
                mb: 2,
                border: 1,
                borderRadius: 4,
                boxShadow: 3,
                maxWidth: 800,
                minWidth: 400,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffffff00',
                    gap: 1,
                }}
            >
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleClick('ToggleRun')}
                    disabled={!runnable && !playOnly}
                >
                    {animationState != 'Run' || playOnly ? (
                        <PlayArrow />
                    ) : (
                        <Pause />
                    )}
                </Button>

                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleClick('Stop')}
                    disabled={!runnable || !testJsonAvailable}
                >
                    <Stop />
                </Button>

                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleClick('PrevFrame')}
                    disabled={!runnable || !testJsonAvailable}
                >
                    <FastRewind />
                </Button>

                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleClick('NextFrame')}
                    disabled={!runnable || !testJsonAvailable}
                >
                    <FastForward />
                </Button>

                <FormControlLabel
                    control={
                        <Switch
                            size="small"
                            defaultChecked
                            onChange={handleChangeDebugInfo}
                            checked={checkedShowDebugInfo}
                            disabled={!runnable || !testJsonAvailable}
                            sx={{
                                width: 42,
                                height: 26,
                                padding: 0,
                                '& .MuiSwitch-switchBase': {
                                    padding: 0,
                                    margin: '2px',
                                    transitionDuration: '300ms',
                                    '&.Mui-checked': {
                                        transform: 'translateX(16px)',
                                        color: '#fff',
                                        '& + .MuiSwitch-track': {
                                            backgroundColor: '#41ff9f',
                                            opacity: 1,
                                            border: 0,
                                        },
                                        '&.Mui-disabled + .MuiSwitch-track': {
                                            opacity: 0.5,
                                        },
                                    },
                                    '&.Mui-focusVisible .MuiSwitch-thumb': {
                                        color: '#52af77',
                                        border: '6px solid #fff',
                                    },
                                    '&.Mui-disabled .MuiSwitch-thumb': {
                                        color: '#888',
                                    },
                                    '&.Mui-disabled + .MuiSwitch-track': {
                                        opacity: 0.7,
                                    },
                                },
                                '& .MuiSwitch-thumb': {
                                    boxSizing: 'border-box',
                                    width: 22,
                                    height: 22,
                                },
                                '& .MuiSwitch-track': {
                                    borderRadius: 26 / 2,
                                    backgroundColor: '#E9E9EA',
                                    opacity: 1,
                                    transition: 500,
                                },
                            }}
                        />
                    }
                    label={
                        <Box
                            component="div"
                            fontSize={'0.75rem'}
                            sx={{ ml: 0.5 }}
                        >
                            <Typography sx={{ fontFamily: 'Eurostile' }}>
                                Debug
                            </Typography>
                        </Box>
                    }
                    sx={{ ml: 1 }}
                />

                {'createdDate' in player && (
                    <SubmitMindButton
                        mind={player}
                        username={player.playerName}
                    />
                )}
            </Box>

            <Box sx={{ minWidth: 400, mt: 3 }}>
                <Slider
                    aria-label="Always visible"
                    value={animationFrame}
                    onChange={handleSlideChange}
                    min={0}
                    max={n_cycles == 0 ? 0 : n_cycles - 1}
                    step={1}
                    getAriaValueText={(value) => `${value}`}
                    valueLabelDisplay="on"
                    sx={{
                        color: '#41ff9f',

                        '& .MuiSlider-thumb': {
                            width: '24px',
                            height: '24px',
                            borderRadius: '12px',
                        },

                        '& .MuiSlider-valueLabel': {
                            fontSize: 12,
                            fontFamily: 'Eurostile',
                            fontWeight: 'normal',
                            top: 4,
                            backgroundColor: 'unset',
                            color: '#eee',
                            '&:before': {
                                display: 'none',
                            },
                            '& *': {
                                background: 'transparent',
                                color: 'fff',
                            },
                        },

                        '& .MuiSlider-rail': {
                            color: '#d8d8d8',
                            opacity: 1,
                            height: 10,
                        },

                        '& .MuiSlider-mark': {
                            width: 10,
                            height: 10,
                            borderRadius: 10,
                        },

                        '& .MuiSlider-track': {
                            height: 10,
                        },
                    }}
                />
                <Box sx={{ position: 'relative' }}>
                    <Chip
                        label="Player 1"
                        color="info"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: -80,
                            fontFamily: 'Eurostile',
                            fontSize: '14px',
                            paddingLeft: '5px',
                            paddingRight: '5px',
                        }}
                    />
                    <Timeline
                        color="info"
                        value={animationFrame}
                        onChange={handleSlideChange}
                        marks={marksP1}
                        step={null}
                        max={n_cycles == 0 ? 0 : n_cycles - 1}
                    />
                </Box>
                <Box sx={{ position: 'relative' }}>
                    <Chip
                        label="Player 2"
                        color="info"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: -80,
                            fontFamily: 'Eurostile',
                            fontSize: '14px',
                            paddingLeft: '5px',
                            paddingRight: '5px',
                        }}
                    />
                    <Timeline
                        color="info"
                        value={animationFrame}
                        onChange={handleSlideChange}
                        marks={marksP2}
                        step={null}
                        max={n_cycles == 0 ? 0 : n_cycles - 1}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default MidScreenControl;
