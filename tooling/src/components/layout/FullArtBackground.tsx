import { Box, BoxProps } from '@mui/material';
import React from 'react';

const FullArtBackground = (props: BoxProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'background.default',
                backgroundImage: 'url(/images/bg/shoshin-menu-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: '50% 50%',
            }}
            {...props}
        />
    );
};

export default FullArtBackground;
