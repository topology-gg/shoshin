import { Box } from '@mui/material';
import React from 'react';

export type EventType = 'hurt' | 'knocked' | 'launched';

const EventSymbol = ({
    type,
    active,
}: {
    type: EventType;
    active?: boolean;
}) => {
    const color =
        type === 'hurt'
            ? '#FEBA4F'
            : type === 'knocked'
            ? '#ED2939'
            : type == 'launched'
            ? '#FD673A'
            : null;

    return (
        <Box
            sx={{
                borderRadius: 100,
                border: 2,
                color,
                width: active ? 12 : 10,
                height: active ? 12 : 10,
                backgroundColor: active ? color : 'white',
            }}
        />
    );
};

export default EventSymbol;
