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
        <Fade in={active} timeout={1000}>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    overflowY: 'scroll',
                }}
            >
                {children}
            </div>
        </Fade>
    );
};

export default SceneSingle;
