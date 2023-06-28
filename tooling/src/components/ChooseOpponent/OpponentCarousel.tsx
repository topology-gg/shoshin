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
import { autoPlay } from 'react-swipeable-views-utils';
import { Medal, Opponent } from '../layout/SceneSelector';
import { numberToCharacter } from '../../constants/constants';

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
    setSelectedIndex: (index: number) => void;
    index: number;
}
function OpponentCarousel({
    opponents,
    setSelectedIndex,
    index,
}: OpponentCarouselProps) {
    const theme = useTheme();

    const initialActiveStep = opponents.findIndex(
        (opp) => opp.medal === Medal.NONE
    );

    const [activeStep, setActiveStep] = React.useState(initialActiveStep);

    React.useEffect(() => {
        setSelectedIndex(activeStep);
    }, [activeStep]);

    const maxSteps = opponents.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    const getCharSource = (char: number) => {
        return char == 0
            ? 'images/jessica/idle/right/frame_0.png'
            : 'images/antoc/idle/right/frame_0.png';
    };
    return (
        <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
            <Paper
                square
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 50,
                    pl: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Typography variant="h4">
                    {numberToCharacter(opponents[activeStep].agent.character)}
                </Typography>
            </Paper>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {opponents.map((oppponent, index) => (
                    <div key={index}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <Box
                                component="img"
                                sx={{
                                    height: 200,
                                    display: 'block',
                                    maxWidth: 400,
                                    overflow: 'hidden',
                                }}
                                src={getCharSource(oppponent.agent.character)}
                            />
                        ) : null}
                    </div>
                ))}
            </SwipeableViews>
            <Typography>Grade: {opponents[activeStep].medal}</Typography>
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
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
                        disabled={activeStep === 0}
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
