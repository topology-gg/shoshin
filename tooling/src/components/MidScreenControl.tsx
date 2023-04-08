import React from "react";
import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import { FastForward, FastRewind, Pause, PlayArrow, Stop } from "@mui/icons-material";
import Slider from '@mui/material/Slider';
import { Frame } from "../types/Frame";
import { BodystatesAntoc, BodystatesJessica } from "../types/Condition";

const MidScreenControl = ({
    runnable, testJsonAvailable, testJson, animationFrame, n_cycles, animationState, handleClick, handleSlideChange,
    checkedShowDebugInfo, handleChangeDebugInfo

}) => {
    const BLANK_COLOR = '#EFEFEF'

    // Calculate key events to be displayed along the timeline slider
    function findFrameNumbersAtHurt (frames: Frame[]){
        if (!frames) return;
        // find the frame number at which the agent is at the first frame (counter == 0) for hurt state (currently need to iterate over all character types)
        // and record that frame number minus one, which is the frame number where the agent is hurt by opponent
        let frameNumbers = []
        frames.forEach((frame, frame_i) => {
            if (
                (frame.body_state.state == BodystatesAntoc.Hurt || frame.body_state.state == BodystatesJessica.Hurt)
                && (frame.body_state.counter == 0)
            ){
                frameNumbers.push(frame_i);
            }
        })
        return frameNumbers
    }
    function findFrameNumbersAtKnocked (frames: Frame[]){
        if (!frames) return
        // find the frame number at which the agent is at the first frame (counter == 0) for hurt state (currently need to iterate over all character types)
        // and record that frame number minus one, which is the frame number where the agent is knocked by opponent
        let frameNumbers = []
        frames.forEach((frame, frame_i) => {
            if (
                (frame.body_state.state == BodystatesAntoc.Knocked || frame.body_state.state == BodystatesJessica.Knocked)
                && (frame.body_state.counter == 0)
            ){
                frameNumbers.push(frame_i);
            }
        })
        return frameNumbers
    }

    const agent_0_frames = testJson?.agent_0.frames
    const agent_1_frames = testJson?.agent_1.frames
    console.log('agent 0: hurt at frame number', findFrameNumbersAtHurt(agent_0_frames), '; knocked at frame number', findFrameNumbersAtKnocked(agent_0_frames))
    console.log('agent 1: hurt at frame number', findFrameNumbersAtHurt(agent_1_frames), '; knocked at frame number', findFrameNumbersAtKnocked(agent_1_frames))

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: BLANK_COLOR,
                p: 2,
                mb: 2,
                border: 1,
                borderRadius: 4,
                boxShadow: 3,
                maxWidth: 800,
                width: 800,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: '#ffffff00',
                    gap: 1,
                }}
            >

                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleClick("ToggleRun")}
                    disabled={!runnable}
                >
                    {animationState != "Run" ? <PlayArrow /> : <Pause />}
                </Button>

                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleClick("Stop")}
                    disabled={!runnable || !testJsonAvailable}
                >
                    <Stop />
                </Button>

                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleClick("PrevFrame")}
                    disabled={!runnable || !testJsonAvailable}
                >
                    <FastRewind />
                </Button>

                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleClick("NextFrame")}
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
                                            backgroundColor: '#52af77',
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
                                        color:'#888'
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
                                    borderRadius: 26/2,
                                    backgroundColor: '#E9E9EA',
                                    opacity: 1,
                                    transition: 500,
                                },
                            }}
                        />
                    }
                    label={
                        <Box component="div" fontSize={'0.75rem'} sx={{ml:0.5}}>
                            Debug
                        </Box>
                    }
                    sx={{ml: 1}}
                />
            </Box>

            <Box sx={{ width: 600, mt:3 }}>
                <Slider
                    aria-label="Always visible"
                    value={animationFrame}
                    onChange={handleSlideChange}
                    min={0}
                    max={n_cycles == 0 ? 0 : n_cycles-1}
                    step={1}
                    getAriaValueText={(value) => `${value}`}
                    marks={[]}
                    valueLabelDisplay="on"
                    sx={{
                        color: '#52af77',

                        '& .MuiSlider-thumb': {
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                        },

                        '& .MuiSlider-valueLabel': {
                            fontSize: 11,
                            fontWeight: 'normal',
                            top:24,
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

                        '& .MuiSlider-track': {
                            height: 10
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default MidScreenControl;
