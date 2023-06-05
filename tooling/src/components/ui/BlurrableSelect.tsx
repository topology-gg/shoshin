import React from 'react';
import { Select, SelectChangeEvent, SelectProps } from '@mui/material';

/**
 * A MUI Select wrapper that auto-blurs itself after change
 */
const BlurrableSelect = ({ onChange, ...props }: SelectProps) => {
    const handleChange = (event: SelectChangeEvent, child: React.ReactNode) => {
        onChange(event, child);
        // Blur the input after changing so that it doesn't interfere with hotkeys in the game
        setTimeout(() => {
            const activeElement = document.activeElement as Element & {
                blur: any;
            };
            typeof activeElement.blur === 'function' && activeElement.blur();
        }, 0);
    };
    return <Select {...props} onChange={handleChange} />;
};

export default BlurrableSelect;
