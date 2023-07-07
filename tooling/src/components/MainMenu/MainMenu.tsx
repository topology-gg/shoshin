import React from 'react';

import { Box, Button, Typography } from '@mui/material';
import styles from './MainMenu.module.css';
import { GameModes } from '../../types/Simulator';
import ShoshinMenu, { ShoshinMenuItem } from './ShoshinMenu';

const MainMenu = React.forwardRef<
    unknown,
    { transition: (gameMode: GameModes) => void }
>(({ transition }, ref) => {
    const items: ShoshinMenuItem[] = [
        {
            title: 'Play',
            onClick: () => transition(GameModes.simulation),
        },
        {
            title: 'Arcade Mode',
            onClick: () => transition(GameModes.realtime),
        },
        {
            title: 'About Shoshin',
        },
        {
            title: 'Profile',
        },
        {
            title: 'Settings',
        },
    ];

    const title = 'Shoshin';
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{ backgroundColor: 'background.default' }}
            ref={ref}
        >
            <ShoshinMenu menuTitle={title} menuItems={items} />
        </Box>
    );
});

export default MainMenu;
