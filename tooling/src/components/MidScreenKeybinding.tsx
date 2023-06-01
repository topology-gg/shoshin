import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, FormControlLabel, Switch } from "@mui/material";
import { ArrowBack, ArrowDownward, ArrowForward, ArrowUpward, FastForward, FastRewind, Pause, PlayArrow, Stop } from "@mui/icons-material";

const JESSICA_KEYS = [
    ['W', 'E', '', '', '', '', ''],
    ['S', 'D', 'F', 'H', '', '', ''],
    ['', '', '', '', 'left', 'down', 'right']
]
const ANTOC_KEYS = [
    ['W', 'E', '', '', '', '', ''],
    ['S', 'D', '', 'H', '', '', ''],
    ['', '', '', '', 'left', 'down', 'right']
]
const keyNameToKeyCode = (whichKey: string): number => {
    switch (whichKey) {
        case 'W':
            return 87;
        case 'E':
            return 69;
        case 'S':
            return 83;
        case 'D':
            return 68;
        case 'F':
            return 70;
        case 'H':
            return 72;
        case 'left':
            return 37;
        case 'down':
            return 40;
        case 'right':
            return 39;
        case 'up':
            return 38;
        default:
            return -1;
    }
}

const MidScreenKeybinding = (
    {realTimeCharacter, keyDownState} :
    {realTimeCharacter : number, keyDownState: { [keycode: number]: boolean }}
)=> {

    const KEYS = realTimeCharacter == 0 ? JESSICA_KEYS : ANTOC_KEYS;

    const KeyElement = (keyName: string, keyDownState: { [keycode: number]: boolean }) => {
        const show = (keyName.length > 0);
        const content = keyName.length == 1 ? (
                <span
                style={{
                    alignSelf : "center"
                 }}
                >{keyName}</span>
            ) : keyName == 'left' ? (
                <ArrowBack
                style={{
                    alignSelf : "center"
                 }}
                />
            ) : keyName == 'down' ? (
                <ArrowDownward
                style={{
                    alignSelf : "center"
                 }}/>
            ) : keyName == 'right' ? (
                <ArrowForward
                style={{
                    alignSelf : "center"
                 }}/>
            ) : <></>;
        const keyCode = keyNameToKeyCode (keyName)
        const isKeyDown = !(keyCode in keyDownState) ? false : keyDownState[keyCode]
        const backgroundColor = isKeyDown ? '#f1573b' : '#EEEEEE'
        const color = isKeyDown ? '#fff' : '#333'
        // const transform = isKeyDown ? 'translate(2px,2px)' : ''

        const borderTopLeft = !show ? 'solid 1px #55555533' : isKeyDown ? 'solid 3px #555555' : 'solid 1px #555555';
        const borderBottomRight = !show ? 'solid 1px #55555533' : !isKeyDown ? 'solid 3px #555555' : 'solid 1px #555555';

        return (
            <div style={{
                width:'30px', height:'30px', margin:'2px',
                borderTop: borderTopLeft, borderLeft: borderTopLeft,
                borderBottom: borderBottomRight, borderRight: borderBottomRight,
                backgroundColor: backgroundColor,
                color: color,
                justifyContent :'center',
                display : "flex",
                // transform: transform,
            }}>
                {content}
            </div>
        )
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                mb: 2,
                border: 1,
                borderRadius: 4,
                boxShadow: 3,
                maxWidth: 800,
                width: 800,
            }}
        >
            {
                KEYS.map((keyRow) => (
                    <div style={{display:'flex', flexDirection:'row'}}>
                        {keyRow.map((key: string) => KeyElement(key, keyDownState))}
                    </div>
                ))
            }
        </Box>
    );
};

export default MidScreenKeybinding;
