import React, { useRef, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import styles from './ChooseOpponent.module.css';
import { useAgents, useLeagueAgents } from '../../../lib/api';
import { SingleMetadata, splitSingleMetadata } from '../../types/Metadata';
import Agent from '../../types/Agent';
import { Medal, Opponent } from '../layout/SceneSelector';
import { Character } from '../../constants/constants';
import OpponentCarousel from './OpponentCarousel';

interface ChooseOpponentProps {
    opponents: Opponent[];
    transitionMainScene: (opp: Agent) => void;
    playerCharacter: Character;
}
const ChooseOpponent = ({
    playerCharacter,
    transitionMainScene,
    opponents,
}: ChooseOpponentProps) => {
    let characterBoxes = [];

    characterBoxes = opponents.map(({ agent, medal }, index) => {
        const handleClick = () => {
            transitionMainScene(agent);
        };

        const imageUrl =
            'images/' +
            (agent.character == 0 ? 'jessica' : 'antoc') +
            '/idle/right/frame_0.png';
        const characterName = agent.character == 0 ? 'Jessica' : 'Antoc';
        return (
            <Box
                key={index}
                className={styles.characterBox}
                onClick={handleClick}
            >
                <Typography variant="h4">{characterName}</Typography>
                <img src={imageUrl} alt="Image 1" height="200px" />
                <Typography variant="body2">
                    Additional descriptive text
                </Typography>

                <Typography variant="body2">Grade: {medal}</Typography>
            </Box>
        );
    });

    const initialSelectedOpponent = opponents.findIndex(
        (opp) => opp.medal === Medal.NONE
    );
    const [selectedOpponent, selectOpponent] = useState<number>(
        initialSelectedOpponent
    );

    const handleFightClick = () => {
        transitionMainScene(opponents[selectedOpponent].agent);
    };
    return (
        <div>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width={'100%'}
            >
                <Typography variant="h5" gutterBottom>
                    Choose your opponent
                </Typography>

                <Box display="flex" justifyContent="center" alignItems="center">
                    <Box
                        width="400px"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        className="character-box"
                    >
                        <Typography variant="h4">Jessica</Typography>
                        <img
                            src="images/jessica/idle/right/frame_0.png"
                            alt="Image 1"
                            height="200px"
                        />
                        <Typography variant="h6">Progress 0%</Typography>
                        <Typography variant="body2">
                            Additional descriptive text
                        </Typography>
                    </Box>
                    <OpponentCarousel
                        opponents={opponents}
                        setSelectedIndex={selectOpponent}
                        index={selectedOpponent}
                    />
                </Box>
                <Button
                    variant="contained"
                    sx={{ marginTop: '30px' }}
                    onClick={handleFightClick}
                >
                    Fight
                </Button>
            </Box>
        </div>
    );
};

export default ChooseOpponent;
