import { Box } from '@mui/material';
import React from 'react';

export type EventType = 'hurt' | 'knocked' | 'launched' | 'ko';

const EventSymbol = ({
    type,
    active,
}: {
    type: EventType;
    active?: boolean;
}) => {
    const color =
        type === 'hurt'
            ? '#FF8000'
            : type === 'knocked'
            ? '#4737DB'
            : type == 'launched'
            ? '#BB0FF5'
            : type == 'ko'
            ? '#ED2939'
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
