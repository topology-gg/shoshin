import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Chip } from '@mui/material';
import styles from './ChooseOpponent.module.css';
import Agent from '../../types/Agent';
import { Medal, Opponent } from '../layout/SceneSelector';
import { Character } from '../../constants/constants';
import OpponentCarousel from './OpponentCarousel';
import Tile, { TileContent } from '../ui/Tile';

interface ChooseOpponentProps {
    opponents: Opponent[];
    transitionMainScene: (opp: Agent) => void;
    playerCharacter: Character;
}
const ChooseOpponent = React.forwardRef<HTMLDivElement, ChooseOpponentProps>(
    ({ playerCharacter, transitionMainScene, opponents }, ref) => {
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

        // Effect to make sure that selectedOpponent is initialized correctly when opponent data loads
        useEffect(() => {
            if (selectedOpponent === -1 && initialSelectedOpponent !== -1) {
                selectOpponent(initialSelectedOpponent);
            }
        }, [initialSelectedOpponent, selectedOpponent]);

        const handleFightClick = () => {
            transitionMainScene(opponents[selectedOpponent].agent);
        };
        return (
            <div ref={ref}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        Choose your opponent
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            gap: 2,
                        }}
                    >
                        <Tile sx={{ width: 400 }} active>
                            <TileContent>
                                <Typography variant="h4">
                                    Jessica{' '}
                                    <Chip
                                        color="primary"
                                        label="Your character"
                                    />
                                </Typography>
                                <img
                                    src="images/jessica/idle/right/frame_0.png"
                                    alt="Image 1"
                                    height="200px"
                                />
                                <Typography variant="h6">
                                    Progress 0%
                                </Typography>
                                <Typography variant="body2">
                                    Additional descriptive text
                                </Typography>
                            </TileContent>
                        </Tile>
                        <OpponentCarousel
                            opponents={opponents}
                            onOpponentChange={selectOpponent}
                            selectedOpponent={selectedOpponent}
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
    }
);

export default ChooseOpponent;
