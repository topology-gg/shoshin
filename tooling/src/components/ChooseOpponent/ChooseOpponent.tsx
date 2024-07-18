import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, IconButton } from '@mui/material';
import styles from './ChooseOpponent.module.css';
import { Character } from '../../constants/constants';
import CardCarousel3D from '../CardCarousel/CardCarousel3D';
import FullArtBackground from '../layout/FullArtBackground';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import OpponentTile from '../ChooseCharacter/OpponentTile';
import { Medal, Opponent } from '../../types/Opponent';
import ScoreDisplay from './ScoreDisplay';

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

        // 3d carousel is having issues initializing at the correct index
        //Setting default as 0 each time for now
        const [selectedOpponent, selectOpponent] = useState<number>(0);

        characterBoxes = opponents.map(
            ({ agent, medal, mindName, backgroundId }, index) => {
                const handleClick = () => {
                    transitionMainScene(index);
                };

                const character: Character =
                    agent.character == 0 ? Character.Jessica : Character.Antoc;

                const imageUrl =
                    'images/' +
                    character.toLowerCase() +
                    '/idle/right/frame_0.png';

                console.log('mindName:', mindName, 'index:', index);

                return (
                    <OpponentTile
                        character={character}
                        key={index}
                        mediaCover={
                            <div className={styles.characterFooter}>
                                <img
                                    src={imageUrl}
                                    alt="Image 1"
                                    className={styles.characterModel}
                                />
                            </div>
                        }
                        mindName={mindName}
                        backgroundId={backgroundId}
                    ></OpponentTile>
                );
            }
        );

        // Effect to make sure that selectedOpponent is initialized correctly when opponent data loads
        useEffect(() => {
            if (selectedOpponent === -1 && initialSelectedOpponent !== -1) {
                //selectOpponent(initialSelectedOpponent);
            }
        }, [initialSelectedOpponent, selectedOpponent]);

        const handleFightClick = () => {
            transitionMainScene(selectedOpponent);
        };

        const selectedOpponentName =
            opponents[selectedOpponent].agent.character == 0
                ? 'Jessica'
                : 'Antoc';
        const selectedOpponentGrade = opponents[selectedOpponent].medal;
        const selectedOpponentScore =
            opponents[selectedOpponent].scoreMap?.totalScore;

        const decrementSelectedOpponent = () => {
            const newIndex =
                selectedOpponent - 1 < 0
                    ? opponents.length - 1
                    : selectedOpponent - 1;
            selectOpponent(newIndex);
        };

        const incrementSelectedOpponent = () => {
            const newIndex = (selectedOpponent + 1) % opponents.length;
            selectOpponent(newIndex);
        };

        const mindName = opponents[selectedOpponent]?.mindName;

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
                                display={'flex'}
                                flexDirection={'row'}
                                width={'80%'}
                            >
                                <Box
                                    sx={{
                                        width: '50%',
                                        minWidth: '800px',
                                        minHeight: '600px',
                                        height: '50vh',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <IconButton
                                        onClick={() =>
                                            decrementSelectedOpponent()
                                        }
                                    >
                                        <img
                                            src="./images/ui/next-opponent-left.png"
                                            alt="Button Icon"
                                        />
                                    </IconButton>
                                    <CardCarousel3D
                                        offset={2}
                                        showArrows={false}
                                        cards={characterBoxes}
                                        currentIndex={selectedOpponent}
                                        selectIndex={selectOpponent}
                                    />
                                    <IconButton
                                        onClick={() =>
                                            incrementSelectedOpponent()
                                        }
                                    >
                                        <img
                                            src="./images/ui/next-opponent-right.png"
                                            alt="Button Icon"
                                        />
                                    </IconButton>
                                </Box>

                                <Box
                                    maxHeight={'60vh'}
                                    width={'100%'}
                                    sx={{
                                        overflowY: 'auto',
                                        marginBottom: '16px',
                                    }}
                                >
                                    <ScoreDisplay
                                        opponentIndex={selectedOpponent}
                                    />
                                </Box>
                            </Box>
                            <Grid container>
                                <Grid item xs={5}></Grid>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6">
                                        {selectedOpponent + 1} /{' '}
                                        {opponents.length}
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        Best Score:{' '}
                                        {selectedOpponentScore ?? '---'}
                                    </Typography>
                                    {/* {mindName !== undefined && (
                                        <Typography variant="body2">
                                            Level Name : {mindName}
                                        </Typography>
                                    )} */}
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
                                            isAlt
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
