import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid } from '@mui/material';
import styles from './ChooseOpponent.module.css';
import { Medal, Opponent } from '../layout/SceneSelector';
import { Character } from '../../constants/constants';
import CardCarousel3D from '../CardCarousel/CardCarousel3D';
import FullArtBackground from '../layout/FullArtBackground';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';

interface ChooseOpponentProps {
    opponents: Opponent[];
    transitionMainScene: (opp: number) => void;
    transitionBack: () => void;
    playerCharacter: Character;
}
const ChooseOpponent = React.forwardRef<HTMLDivElement, ChooseOpponentProps>(
    (
        { playerCharacter, transitionMainScene, opponents, transitionBack },
        ref
    ) => {
        let characterBoxes = [];

        const initialSelectedOpponent = opponents.findIndex(
            (opp) => opp.medal === Medal.NONE
        );

        const [selectedOpponent, selectOpponent] = useState<number>(
            initialSelectedOpponent !== -1 ? initialSelectedOpponent : 0
        );

        characterBoxes = opponents.map(({ agent, medal }, index) => {
            const handleClick = () => {
                transitionMainScene(index);
            };

            const cardUrl =
                'images/ui/' +
                (agent.character == 0 ? 'jessica' : 'antoc') +
                '-portrait.jpeg';

            const imageUrl =
                'images/' +
                (agent.character == 0 ? 'jessica' : 'antoc') +
                '/idle/right/frame_0.png';
            const characterName = agent.character == 0 ? 'Jessica' : 'Antoc';
            return (
                <Box
                    key={index}
                    className={styles.characterBox}
                    sx={{
                        backgroundImage: `url(${cardUrl})`,
                        backgroundSize: 'cover',
                        //DO OTHER CSS IN CSS MODULE
                        //filter: true ? 'brightness(100%)' : 'brightness(50%)',
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="Image 1"
                        className={styles.characterModel}
                    />
                </Box>
            );
        });

        // Effect to make sure that selectedOpponent is initialized correctly when opponent data loads
        useEffect(() => {
            if (selectedOpponent === -1 && initialSelectedOpponent !== -1) {
                selectOpponent(initialSelectedOpponent);
            }
        }, [initialSelectedOpponent, selectedOpponent]);

        const handleFightClick = () => {
            transitionMainScene(selectedOpponent);
        };

        const characterName =
            playerCharacter == Character.Jessica ? 'Jessica' : 'Antoc';
        const characterImageUrl =
            playerCharacter == Character.Jessica
                ? 'images/jessica/idle/right/frame_0.png'
                : 'images/antoc/idle/right/frame_0.png';

        const selectedOpponentName =
            opponents[selectedOpponent].agent.character == 0
                ? 'Jessica'
                : 'Antoc';
        const selectedOpponentGrade = opponents[selectedOpponent].medal;

        return (
            <div ref={ref}>
                <FullArtBackground useAlt={true}>
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
                        <Typography variant="h3" gutterBottom>
                            Choose your opponent
                        </Typography>
                        <ShoshinMenuButton
                            variant="text"
                            size="large"
                            sx={{ width: 200 }}
                        >
                            {selectedOpponentName}
                        </ShoshinMenuButton>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '50%',
                                    minWidth: '600px',
                                    minHeight: '600px',
                                    height: '50vh',
                                }}
                            >
                                <CardCarousel3D
                                    offset={2}
                                    showArrows={true}
                                    cards={characterBoxes}
                                    currentIndex={selectedOpponent}
                                    selectIndex={selectOpponent}
                                />
                            </Box>
                            <Grid container>
                                <Grid item xs={5}></Grid>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" fontWeight="bold">
                                        Grade: {selectedOpponentGrade}
                                    </Typography>
                                    <Typography variant="body2">
                                        Strategy : Offense
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}>
                                    <Box display={'flex'}>
                                        <ShoshinMenuButton
                                            sx={{ width: 150 }}
                                            onClick={transitionBack}
                                        >
                                            Back
                                        </ShoshinMenuButton>
                                        <ShoshinMenuButton
                                            sx={{ width: 175 }}
                                            onClick={handleFightClick}
                                        >
                                            Fight
                                        </ShoshinMenuButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </FullArtBackground>
            </div>
        );
    }
);

export default ChooseOpponent;
