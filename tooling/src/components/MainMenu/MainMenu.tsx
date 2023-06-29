import { Box, Button, Typography } from '@mui/material';
import styles from './MainMenu.module.css';
import { GameModes } from '../../types/Simulator';
import ShoshinMenu, { ShoshinMenuItem } from './ShoshinMenu';

const MainMenu = ({ transition }) => {
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
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Set the container height to 100% viewport height
            }}
        >
            <ShoshinMenu menuTitle={title} menuItems={items} />
        </Box>
    );
};

export default MainMenu;
