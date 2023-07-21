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
            ? 'warning.light'
            : type === 'knocked'
            ? 'error.main'
            : type == 'launched'
            ? 'background.default'
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
