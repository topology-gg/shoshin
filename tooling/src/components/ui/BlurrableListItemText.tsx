import { ListItemText, ListItemTextProps } from '@mui/material';
import React from 'react';

/**
 * A button wrapper that auto-blurs itself after change
 */
const BlurrableListItemText = ({
    children,
    onClick,
    ...props
}: ListItemTextProps) => {
    const handleClick = (event) => {
        onClick?.(event);
        setTimeout(() => {
            const activeElement = document.activeElement as Element & {
                blur: any;
            };
            typeof activeElement.blur === 'function' && activeElement.blur();

            const motherElement = document.getElementById('mother');
            motherElement.focus();
        }, 0);
    };
    return (
        <ListItemText {...props} onClick={handleClick}>
            {children}
        </ListItemText>
    );
};

export default BlurrableListItemText;
