import React from 'react';
import { Box, BoxProps } from '@mui/material';

import s from './GameCard.module.css';

const GameCard = ({
    children,
    mediaCover,
    image,
    ...props
}: Omit<BoxProps, 'className'> & {
    image: string;
    mediaCover?: React.ReactNode;
}) => {
    return (
        <Box
            {...props}
            className={`${s.card} ${props.onClick && s.cardClickable}`}
        >
            <div
                className={s.media}
                style={{ '--bg-image': `url(${image})` } as React.CSSProperties}
            >
                {mediaCover}
            </div>
            <div className={s.content}>{children}</div>
        </Box>
    );
};

export default GameCard;
