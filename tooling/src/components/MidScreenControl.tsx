import React from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";

const MidScreenControl = ({
    runnable = true, animationFrame, n_cycles, animationState, handleClick, handleSlideChange,
    checkedShowDebugInfo, handleChangeDebugInfo

}) => {

    const makeshift_button_style = { marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem" };
    const makeshift_run_button_style = runnable
        ? makeshift_button_style
        : { ...makeshift_button_style, color: "#CCCCCC" };

    const BLANK_COLOR = '#EFEFEF'

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "27rem",
                backgroundColor: BLANK_COLOR,
                p: "1rem",
                mt: "1rem",
                border: 1,
                borderRadius: 4,
                boxShadow: 3,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "27rem",
                    backgroundColor: '#ffffff00',
                    p: "1rem",
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
                    Frame {animationFrame+1} / {n_cycles}
                </p>

                <input
                    id="typeinp"
                    type="range"
                    min="0"
                    max={n_cycles-1}
                    value={animationFrame}
                    onChange={handleSlideChange}
                    step="1"
                    style={{ width: "6.5rem" }}
                    disabled={animationState == 'Run'}
                />

                {/* ref: https://stackoverflow.com/questions/22885702/html-for-the-pause-symbol-in-audio-and-video-control */}
                <button
                    style={{ ...makeshift_run_button_style, marginLeft: "0.5rem" }}
                    onClick={() => handleClick("ToggleRun")}
                    className={animationState == "Pause" ? "paused" : ""}
                >
                    {" "}
                    {animationState != "Run" ? (
                        <i className="material-icons" style={{ fontSize: "1.2rem" }}>
                            play_arrow
                        </i>
                    ) : (
                        <i className="material-icons" style={{ fontSize: "1.2rem" }}>
                            pause
                        </i>
                    )}{" "}
                </button>
                <button style={makeshift_button_style} onClick={() => handleClick("Stop")}>
                    <i className="material-icons" style={{ fontSize: "1.2rem" }}>
                        stop
                    </i>
                </button>

                <button style={makeshift_button_style} onClick={() => handleClick("PrevFrame")}>
                    <i className="material-icons" style={{ fontSize: "1.2rem" }}>
                        fast_rewind
                    </i>
                </button>
                <button style={makeshift_button_style} onClick={() => handleClick("NextFrame")}>
                    <i className="material-icons" style={{ fontSize: "1.2rem" }}>
                        fast_forward
                    </i>
                </button>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "27rem",
                    backgroundColor: '#ffffff00',
                    p: "1rem",
                }}
            >
                <label style={{fontSize:'12px'}}>
                    <input
                        type="checkbox"
                        checked={checkedShowDebugInfo}
                        onChange={handleChangeDebugInfo}
                        style={{ verticalAlign:"middle", marginRight:'10px'}}
                    />
                    Show debug info
                </label>

            </Box>

        </Box>
    );
};

export default MidScreenControl;
