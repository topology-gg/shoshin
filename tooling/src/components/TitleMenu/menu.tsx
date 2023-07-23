import React, { useState } from 'react';
import { Box, Fade, Typography } from '@mui/material';
import FullArtBackground from '../layout/FullArtBackground';
import IntroVideoBackground from './IntroVideoBackground';

type TitleMenuProps = {
    transitionMainMenu: () => void;
    onPlayVideo: () => void;
};

const TitleMenu = React.forwardRef<unknown, TitleMenuProps>(
    ({ transitionMainMenu, onPlayVideo }, ref) => {
        const [clicked, setClicked] = useState(false);

        const handleClickToContinue = () => {
            setClicked(true);
            onPlayVideo();
        };

        return (
            <FullArtBackground ref={ref}>
                <IntroVideoBackground
                    onClick={() => transitionMainMenu()}
                    onEnded={() => transitionMainMenu()}
                    playing={clicked}
                />
                <Fade in={!clicked}>
                    <Box
                        sx={{
                            zIndex: '2',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'black',
                            cursor: 'pointer',
                        }}
                        onClick={handleClickToContinue}
                    >
                        <span style={{ color: '#ffffff', fontSize: '36px' }}>
                            Click to continue
                        </span>
                    </Box>
                </Fade>
            </FullArtBackground>
        );
    }
);

export default TitleMenu;
