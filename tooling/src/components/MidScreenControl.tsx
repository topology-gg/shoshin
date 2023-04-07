import React from "react";
import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import { FastForward, FastRewind, Pause, PlayArrow, Stop } from "@mui/icons-material";

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
                <p
                    style={{
                        padding: "0",
                        textAlign: "center",
                        verticalAlign: "middle",
                        width: "7rem",
                        margin: "0 0.5rem 0 0",
                        // width: "100px" /* Make room for dynamic text */,
                        height: "20px",
                        lineHeight: "20px",
                        fontSize: "0.75rem",
                    }}
                >
                    {" "}
                    Frame {!testJsonAvailable ? '-' : animationFrame+1} / {!testJsonAvailable ? '-' : n_cycles}
                </p>

                <input
                    id="typeinp"
                    type="range"
                    min="0"
                    max={n_cycles-1}
                    value={animationFrame}
                    onChange={handleSlideChange}
                    step="1"
                    style={{ flex: 1, width: "auto" }}
                    disabled={animationState == 'Run' || !runnable || !testJsonAvailable}
                />

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
                        />
                    }
                    label={
                        <Box component="div" fontSize={'0.75rem'}>
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
