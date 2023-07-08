import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './menu.module.css';
import LogoBig from '../layout/LogoBig';
import FullArtBackground from '../layout/FullArtBackground';

type TitleMenuProps = {
    transitionMainMenu: () => void;
};

const TitleMenu = React.forwardRef<unknown, TitleMenuProps>(
    ({ transitionMainMenu }, ref) => {
        return (
            <FullArtBackground ref={ref} onClick={() => transitionMainMenu()}>
                <Box
                    sx={{
                        zIndex: '2',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <LogoBig />
                    <Typography
                        component="h1"
                        gutterBottom
                        color="text.secondary"
                    >
                        Click to continue
                    </Typography>
                </Box>
                <video
                    className={styles.backgroundVideo}
                    autoPlay
                    loop
                    muted
                    src="media/fight-intro.mp4"
                ></video>
            </FullArtBackground>
        );
    }
);

export default TitleMenu;
