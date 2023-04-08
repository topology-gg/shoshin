import React from "react";
import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import { FastForward, FastRewind, Pause, PlayArrow, Stop } from "@mui/icons-material";
import Slider from '@mui/material/Slider';

const MidScreenControl = ({
    runnable, testJsonAvailable, animationFrame, n_cycles, animationState, handleClick, handleSlideChange,
    checkedShowDebugInfo, handleChangeDebugInfo

}) => {
    const BLANK_COLOR = '#EFEFEF'

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: BLANK_COLOR,
                p: "0.5rem",
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
                {/* <input
                    id="typeinp"
                    type="range"
                    min="0"
                    max={n_cycles-1}
                    value={animationFrame}
                    onChange={handleSlideChange}
                    step="1"
                    style={{ flex: 1, width: "auto" }}
                    disabled={animationState == 'Run' || !runnable || !testJsonAvailable}
                /> */}

                <Box sx={{ width: 300, mr:3 }}>
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

                {/* <Button
                    id={"submit-button"}
                    size="small"
                    variant="outlined"
                    onClick={() => handleClickSubmit()}
                >
                    <i className="material-icons" style={{ fontSize: "1.25rem"}}>
                        send
                    </i>
                </Button> */}

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
        </Box>
    );
};

export default MidScreenControl;
