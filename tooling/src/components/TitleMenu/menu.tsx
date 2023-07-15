import React from 'react';
import { Box } from '@mui/material';
import FullArtBackground from '../layout/FullArtBackground';
import IntroVideoBackground from './IntroVideoBackground';

type TitleMenuProps = {
    transitionMainMenu: () => void;
};

const TitleMenu = React.forwardRef<unknown, TitleMenuProps>(
    ({ transitionMainMenu }, ref) => {
        return (
            <FullArtBackground ref={ref} onClick={() => transitionMainMenu()}>
                <IntroVideoBackground onEnded={() => transitionMainMenu()} />
                <Box
                    sx={{
                        zIndex: '2',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {/* <Typography
                        component="h1"
                        gutterBottom
                        color="text.secondary"
                    >
                        Click to continue
                    </Typography> */}
                </Box>
            </FullArtBackground>
        );
    }
);

export default TitleMenu;
