import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './menu.module.css';

type TitleMenuProps = {
    transitionMainMenu: () => void;
};

const TitleMenu = React.forwardRef<unknown, TitleMenuProps>(
    ({ transitionMainMenu }, ref) => {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                onClick={() => transitionMainMenu()}
                ref={ref}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Shoshin
                </Typography>
                <Typography component="h1" gutterBottom color="textSecondary">
                    Click to continue
                </Typography>
                <video
                    className={styles.backgroundVideo}
                    autoPlay
                    loop
                    muted
                    src="media/fight-intro.mp4"
                ></video>
            </Box>
            /*  */
        );
    }
);

export default TitleMenu;
