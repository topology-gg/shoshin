import { Fade } from '@mui/material';
import React, { ReactElement } from 'react';

const SceneSingle = ({
    active,
    children,
}: {
    active: boolean;
    children: ReactElement;
}) => {
    return (
        <Fade in={active} style={{ position: 'absolute', top: 0, left: 0 }}>
            {children}
        </Fade>
    );
};

export default SceneSingle;
