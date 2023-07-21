import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { Character } from '../../constants/constants';
import GameCard from '../ui/GameCard';

const CharacterTile = ({
    character,
    children,
    mediaCover,
    onClick,
    progressText,
}: {
    character: Character;
    children?: React.ReactNode;
    mediaCover?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    progressText?: React.ReactNode;
}) => {
    const idleImage = `/images/ui/${character.toLowerCase()}-sketch-inverted.png`;
    const activeImage = `/images/ui/${character.toLowerCase()}-portrait.jpeg`;

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
            mediaCover={mediaCover}
            onClick={onClick}
            onMouseOver={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
        >
            <Typography variant="h3">{character}</Typography>
            {progressText && (
                <Typography variant="h6" color={textColor}>
                    {progressText}
                </Typography>
            )}
            {children}
        </GameCard>
    );
};

export default CharacterTile;
