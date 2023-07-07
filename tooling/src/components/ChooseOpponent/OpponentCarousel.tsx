import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { Opponent } from '../layout/SceneSelector';
import { numberToCharacter } from '../../constants/constants';
import Tile, { TileContent } from '../ui/Tile';

const images = [
    {
        label: 'San Francisco – Oakland Bay Bridge, United States',
        imgPath:
            'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
    },
    {
        label: 'Bird',
        imgPath:
            'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
    },
    {
        label: 'Bali, Indonesia',
        imgPath:
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250',
    },
    {
        label: 'Goč, Serbia',
        imgPath:
            'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
    },
];

interface OpponentCarouselProps {
    opponents: Opponent[];
    onOpponentChange: (index: number) => void;
    selectedOpponent: number;
}
function OpponentCarousel({
    opponents,
    onOpponentChange,
    selectedOpponent,
}: OpponentCarouselProps) {
    const theme = useTheme();

    const maxSteps = opponents.length;

    const handleNext = () => {
        onOpponentChange(selectedOpponent + 1);
    };

    const handleBack = () => {
        onOpponentChange(selectedOpponent - 1);
    };

    const handleStepChange = (step: number) => {
        onOpponentChange(step);
    };

    const getCharSource = (char: number) => {
        return char == 0
            ? 'images/jessica/idle/right/frame_0.png'
            : 'images/antoc/idle/right/frame_0.png';
    };
    const selectedOpponentObj = opponents[selectedOpponent];

    return (
        <Box>
            <Tile sx={{ maxWidth: 400, flexGrow: 1 }}>
                <TileContent>
                    <Paper
                        square
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: 50,
                            pl: 2,
                        }}
                    >
                        <Typography variant="h4">
                            {opponents[selectedOpponent]
                                ? numberToCharacter(
                                      selectedOpponentObj.agent.character
                                  )
                                : 'No opponent'}
                        </Typography>
                    </Paper>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={selectedOpponent}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {opponents.map((oppponent, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                {Math.abs(selectedOpponent - index) <= 2 ? (
                                    <Box
                                        component="img"
                                        sx={{
                                            height: 200,
                                            display: 'block',
                                            maxWidth: 400,
                                            overflow: 'hidden',
                                        }}
                                        src={getCharSource(
                                            oppponent.agent.character
                                        )}
                                    />
                                ) : null}
                            </Box>
                        ))}
                    </SwipeableViews>
                    <Typography>
                        Grade:{' '}
                        {opponents[selectedOpponent]
                            ? opponents[selectedOpponent].medal
                            : 'N/A'}
                    </Typography>
                </TileContent>
            </Tile>
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={selectedOpponent}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={selectedOpponent === maxSteps - 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button
                        size="small"
                        onClick={handleBack}
                        disabled={selectedOpponent === 0}
                    >
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
            />
        </Box>
    );
}

export default OpponentCarousel;
