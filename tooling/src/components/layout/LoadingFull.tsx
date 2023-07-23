import { Box, BoxProps, Typography } from '@mui/material';
import React from 'react';

const LoadingFull = React.forwardRef<HTMLDivElement>((props: BoxProps, ref) => {
    const bgUrl = `url(/images/bg/loading-bg.jpeg)`;
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'end',
                alignItems: 'flex-end',
                height: '100vh',
                backgroundImage: bgUrl,
                backgroundSize: 'cover',
                backgroundPosition: '50% 50%',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 30,
            }}
            {...props}
            ref={ref}
        >
            <Typography variant="h3" color={'white'} padding={3}>
                Loading...
            </Typography>
        </Box>
    );
});

export default LoadingFull;
