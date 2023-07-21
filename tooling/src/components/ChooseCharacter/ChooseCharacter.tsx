import React from 'react';

import { Box, Typography } from '@mui/material';
import { Character } from '../../constants/constants';
import FullArtBackground from '../layout/FullArtBackground';
import CharacterTile from './CharacterTile';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';

const ChooseCharacter = React.forwardRef<
    HTMLDivElement,
    {
        transitionChooseOpponent: (character: Character) => void;
        transitionBack: () => void;
        jessicaProgress: number;
        antocProgress: number;
        antocGoldCount: number;
        jessicaGoldCount: number;
        opponentCount: number;
    }
>(
    (
        {
            transitionChooseOpponent,
            transitionBack,
            jessicaProgress,
            antocProgress,
            jessicaGoldCount,
            antocGoldCount,
            opponentCount,
        },
        ref
    ) => {
        const jessicaProgressText =
            jessicaProgress < 100
                ? `Progress ${jessicaProgress}%`
                : `Gold Medals ${jessicaGoldCount}/${opponentCount}`;

        const antocProgressText =
            antocProgress < 100
                ? `Progress ${antocProgress}%`
                : `Gold Medals ${antocGoldCount}/${opponentCount}`;

        return (
            <div ref={ref}>
                <FullArtBackground useAlt gap={2}>
                    <Typography
                        variant="poster"
                        color="text.primary"
                        gutterBottom
                    >
                        Choose your character
                    </Typography>

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={5}
                    >
                        <CharacterTile
                            character={Character.Jessica}
                            onClick={() =>
                                transitionChooseOpponent(Character.Jessica)
                            }
                            progressText={jessicaProgressText}
                        />

                        <CharacterTile
                            character={Character.Antoc}
                            onClick={() =>
                                transitionChooseOpponent(Character.Antoc)
                            }
                            progressText={antocProgressText}
                        />
                    </Box>
                    <ShoshinMenuButton
                        sx={{ width: 150 }}
                        onClick={transitionBack}
                    >
                        Back
                    </ShoshinMenuButton>
                </FullArtBackground>
            </div>
        );
    }
);

export default ChooseCharacter;
