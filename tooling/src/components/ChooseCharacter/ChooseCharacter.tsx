import React from 'react';

import { Box, Typography } from '@mui/material';
import { Character } from '../../constants/constants';
import FullArtBackground from '../layout/FullArtBackground';
import CharacterTile from './CharacterTile';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';

const ActionReferenceButton = ({
    transitionToActionReference,
    character,
}: {
    transitionToActionReference: (character: Character) => void;
    character: Character;
}) => (
    <ShoshinMenuButton
        onClick={(e) => {
            transitionToActionReference(character);
            e.stopPropagation();
        }}
    >
        Action Reference
    </ShoshinMenuButton>
);

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
        transitionToActionReference: (character: Character) => void;
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
            transitionToActionReference,
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
                            footer={
                                <ActionReferenceButton
                                    character={Character.Jessica}
                                    transitionToActionReference={
                                        transitionToActionReference
                                    }
                                />
                            }
                        />

                        <CharacterTile
                            character={Character.Antoc}
                            onClick={() =>
                                transitionChooseOpponent(Character.Antoc)
                            }
                            progressText={antocProgressText}
                            footer={
                                <ActionReferenceButton
                                    character={Character.Antoc}
                                    transitionToActionReference={
                                        transitionToActionReference
                                    }
                                />
                            }
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
