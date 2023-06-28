import {
    Box,
    Button,
    Grid,
    IconButton,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from '@mui/material';
import { Character } from '../../constants/constants';
import { CHARACTERS_ACTIONS } from '../../types/Action';
import { useState } from 'react';
import RightChevronIcon from '@mui/icons-material/ChevronRight';

interface MoveTutorialProps {
    character: Character;
    firstVisit: boolean;
    onContinue: () => void;
}
const MoveTutorial = ({
    character,
    firstVisit,
    onContinue,
}: MoveTutorialProps) => {
    const imageUrl =
        'images/' + character.toLocaleLowerCase() + '/idle/right/frame_0.png';

    const moves = CHARACTERS_ACTIONS[
        character == Character.Jessica ? 0 : 1
    ].filter((action) => action.tutorial !== undefined);

    const tutorials = moves.map((action) => {
        return (
            <Box
                position={'relative'}
                height={'500px'}
                width={'100%'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
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
        <Grid container spacing={2} justifyContent="center" height={'100vh'}>
            {/* Div with width 4 */}
            <Grid item xs={5}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={'100vh'}
                >
                    <img src={imageUrl} alt="Image 1" height="400px" />
                </Box>
            </Grid>

            {/* Other grid items */}
            <Grid item xs={5}>
                <Box
                    display="flex"
                    flexDirection={'column'}
                    justifyContent="center"
                    alignItems="center"
                    height={'100vh'}
                >
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
                        width={'100%'}
                    >
                        <IconButton
                            aria-label="Arrow Right"
                            size="large"
                            onClick={onContinue}
                            disabled={canContinue}
                        >
                            Continue <RightChevronIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default MoveTutorial;
