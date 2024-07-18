import React from 'react';
import { Box, BoxProps } from '@mui/material';

import s from './CardSimple.module.css';

const CardSimple = ({
    children,
    mediaCover,
    image,
    bgOpacity = 1,
    ...props
}: Omit<BoxProps, 'className'> & {
    image?: string;
    bgOpacity?: number;
    mediaCover?: React.ReactNode;
}) => {
    return (
        <Box
            {...props}
            className={`${s.card} ${props.onClick && s.cardClickable}`}
            data-translucent={bgOpacity < 1}
        >
            <div
                className={s.media}
                style={
                    image
                        ? ({
                              '--bg-image': `url(${image})`,
                              opacity: bgOpacity,
                          } as React.CSSProperties)
                        : {}
                }
            >
                {mediaCover}
            </div>
            <div className={s.content}>{children}</div>
        </Box>
    );
};

export default CardSimple;
