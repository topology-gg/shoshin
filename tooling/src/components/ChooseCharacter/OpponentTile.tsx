import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { Character } from '../../constants/constants';
import GameCard from '../ui/GameCard';

const OpponentTile = ({
    character,
    children,
    descriptionVisible,
    footer,
    mediaCover,
    onClick,
    progressText,
    backgroundId,
    mindName,
}: {
    character: Character;
    children?: React.ReactNode;
    descriptionVisible?: boolean;
    footer?: React.ReactNode;
    mediaCover?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    progressText?: React.ReactNode;
    backgroundId?: number;
    mindName?: string;
}) => {
    const idleImage = !backgroundId
        ? '/images/bg/shoshin-bg-gray-long.png'
        : backgroundId == 1
        ? '/images/bg/forest/full.png'
        : backgroundId == 2
        ? '/images/bg/stone/full.jpeg'
        : backgroundId == 3
        ? '/images/bg/desert/full.jpeg'
        : backgroundId == 4
        ? '/images/bg/cave/full.png'
        : backgroundId == 5
        ? '/images/bg/volcano/full.jpeg'
        : '/images/bg/shoshin-bg-gray-long.png';
    const activeImage = idleImage;

    const [hovering, setHovering] = useState(false);

    const image = onClick ? (hovering ? activeImage : idleImage) : activeImage;
    // const textColor = image === idleImage ? 'text.primary' : 'text.secondary';
    const textColor = 'white';

    return (
        <GameCard
            image={image}
            sx={{
                width: 300,
                height: 500,
                color: textColor,
                position: 'relative',
            }}
            footer={footer}
            mediaCover={mediaCover}
            onClick={onClick}
            onMouseOver={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
        >
            <Typography variant="h3">{mindName}</Typography>
            {progressText && (
                <Typography variant="h6" color={textColor}>
                    {progressText}
                </Typography>
            )}
            {children}
        </GameCard>
    );
};

export default OpponentTile;
