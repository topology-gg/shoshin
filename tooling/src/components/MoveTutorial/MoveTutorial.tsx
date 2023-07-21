import React from 'react';
import {
    Box,
    Button,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from '@mui/material';
import { Character } from '../../constants/constants';
import { CHARACTERS_ACTIONS } from '../../types/Action';
import { useState } from 'react';
import RightChevronIcon from '@mui/icons-material/ChevronRight';
import FullArtBackground from '../layout/FullArtBackground';
import Tile, { TileContent } from '../ui/Tile';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import CharacterTile from '../ChooseCharacter/CharacterTile';

interface MoveTutorialProps {
    character: Character;
    firstVisit: boolean;
    onContinue: () => void;
}

const MoveTutorial = React.forwardRef<HTMLDivElement, MoveTutorialProps>(
    ({ character, firstVisit, onContinue }, ref) => {
        const moves = CHARACTERS_ACTIONS[
            character == Character.Jessica ? 0 : 1
        ].filter((action) => action.tutorial !== undefined);

        const tutorials = moves.map((action) => {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                    ref={ref}
                >
                    <video
                        src={action.tutorial.video}
                        autoPlay
                        loop
                        muted
                        style={{
                            width: '100%',
                        }}
                    ></video>
                    <Typography variant="h4">
                        {action.display.unicode}
                        {'  '}
                        {action.display.name}
                    </Typography>
                    <Typography>{action.tutorial.description}</Typography>
                    <Typography>
                        Attack Duration : {action.frames.duration}
                    </Typography>
                </Box>
            );
        });

        const [selectedMove, changeSelectedMove] = useState<number>(0);

        const canContinue = !firstVisit || selectedMove === moves.length - 1;
        return (
            <FullArtBackground useAlt gap={2}>
                <Typography variant="poster" color="text.primary" gutterBottom>
                    Study your moves
                </Typography>
                <Box
                    gap={2}
                    sx={{
                        display: 'flex',
                        alignItems: 'stretch',
                    }}
                >
                    <CharacterTile character={character} />

                    <Tile
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 450,
                        }}
                    >
                        <TileContent sx={{ justifyContent: 'center', gap: 2 }}>
                            {tutorials[selectedMove]}

                            <Stepper activeStep={selectedMove} alternativeLabel>
                                {moves.map((move, index) => (
                                    <Step key={move.display.name}>
                                        <Button
                                            color="inherit"
                                            onClick={() => {
                                                changeSelectedMove(index);
                                            }}
                                        >
                                            <StepLabel>
                                                {move.display.unicode}
                                            </StepLabel>
                                        </Button>
                                    </Step>
                                ))}
                            </Stepper>
                            <Box
                                display="flex"
                                flexDirection={'row'}
                                justifyContent={'flex-end'}
                            ></Box>
                        </TileContent>
                    </Tile>
                </Box>
                <ShoshinMenuButton
                    size="large"
                    onClick={onContinue}
                    disabled={!canContinue}
                >
                    Continue <RightChevronIcon />
                </ShoshinMenuButton>
            </FullArtBackground>
        );
    }
);

export default MoveTutorial;
