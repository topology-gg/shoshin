import { Menu, MenuItem } from '@mui/material';
import React from 'react';

const ConditionContextMenu = ({
    children,
    handleInvertCondition,
    layerIndex,
    conditionIndex,
}) => {
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX + 2,
                      mouseY: event.clientY - 6,
                  }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                  null
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleInvertClick = (event) => {
        handleInvertCondition(layerIndex, conditionIndex);
        setContextMenu(null);
    };

    return (
        <div onContextMenu={handleContextMenu} style={{ width: 'fit-content' }}>
            {children}
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={handleInvertClick}>
                    Invert Condition
                </MenuItem>
            </Menu>
        </div>
    );
};

export default ConditionContextMenu;
