import React from 'react';

/**
 * A button wrapper that auto-blurs itself after change
 */
const BlurrableButton = ({ children, onClick, ...props }) => {
    const handleClick = (event) => {
        onClick(event);
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
        <button {...props} onClick={handleClick}>
            {children}
        </button>
    );
};

export default BlurrableButton;
