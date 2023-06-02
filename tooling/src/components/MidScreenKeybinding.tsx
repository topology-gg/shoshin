import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, FormControlLabel, Switch } from '@mui/material';
import {
    ArrowBack,
    ArrowDownward,
    ArrowForward,
    ArrowUpward,
    FastForward,
    FastRewind,
    Pause,
    PlayArrow,
    Stop,
} from '@mui/icons-material';

const JESSICA_KEYS = [
    ['q', '', 'e', '', '', '', ''],
    ['a', 's', 'd', '', 'j', 'k', 'l'],
    ['', '', '', '', '', '', '.'],
];
const ANTOC_KEYS = [
    ['q', '', 'e', '', '', '', ''],
    ['a', 's', 'd', '', 'j', 'k', ''],
    ['', '', '', '', '', '', '.'],
];

const MidScreenKeybinding = ({
    realTimeCharacter,
    keyDownState,
}: {
    realTimeCharacter: number;
    keyDownState: { [keycode: number]: boolean };
}) => {
    const KEYS = realTimeCharacter == 0 ? JESSICA_KEYS : ANTOC_KEYS;

    const KeyElement = (
        keyName: string,
        keyDownState: { [keycode: number]: boolean }
    ) => {
        const show = keyName.length > 0;
        const content =
            keyName.length == 1 ? (
                <span
                    style={{
                        alignSelf: 'center',
                    }}
                >
                    {keyName.toUpperCase()}
                </span>
            ) : keyName == 'left' ? (
                <ArrowBack
                    style={{
                        alignSelf: 'center',
                    }}
                />
            ) : keyName == 'down' ? (
                <ArrowDownward
                    style={{
                        alignSelf: 'center',
                    }}
                />
            ) : keyName == 'right' ? (
                <ArrowForward
                    style={{
                        alignSelf: 'center',
                    }}
                />
            ) : (
                <></>
            );
        const isKeyDown = !(keyName in keyDownState)
            ? false
            : keyDownState[keyName];
        const backgroundColor = isKeyDown ? '#f1573b' : '#EEEEEE';
        const color = isKeyDown ? '#fff' : '#333';
        // const transform = isKeyDown ? 'translate(2px,2px)' : ''

        const borderTopLeft = !show
            ? 'solid 1px #55555533'
            : isKeyDown
            ? 'solid 3px #555555'
            : 'solid 1px #555555';
        const borderBottomRight = !show
            ? 'solid 1px #55555533'
            : !isKeyDown
            ? 'solid 3px #555555'
            : 'solid 1px #555555';

        return (
            <div
                style={{
                    width: '30px',
                    height: '30px',
                    margin: '2px',
                    borderTop: borderTopLeft,
                    borderLeft: borderTopLeft,
                    borderBottom: borderBottomRight,
                    borderRight: borderBottomRight,
                    backgroundColor: backgroundColor,
                    color: color,
                    justifyContent: 'center',
                    display: 'flex',
                    // transform: transform,
                }}
            >
                {content}
            </div>
        );
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                mb: 2,
                border: 1,
                borderRadius: 4,
                boxShadow: 3,
                maxWidth: 800,
                width: 800,
            }}
        >
            {KEYS.map((keyRow) => (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {keyRow.map((key: string) => KeyElement(key, keyDownState))}
                </div>
            ))}
        </Box>
    );
};

export default MidScreenKeybinding;
