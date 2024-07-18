import { Box, BoxProps } from '@mui/material';
import React from 'react';

interface FullArtBackgroundProps extends BoxProps {
    useAlt?: boolean;
}
const FullArtBackground = (props: FullArtBackgroundProps) => {
    const mainBgUrl = `url(/images/bg/shoshin-menu-bg.jpg)`;
    const altBgUrl = `url(/images/bg/shoshin-menu-bg-alt.png)`;
    const image = props.useAlt ? altBgUrl : mainBgUrl;

    const backgroundColor = props.useAlt ? '#e8d4d6' : 'background.default';
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: backgroundColor,
                backgroundImage: image,
                backgroundSize: 'cover',
                backgroundPosition: '50% 50%',
            }}
            {...props}
        />
    );
};

export default FullArtBackground;
