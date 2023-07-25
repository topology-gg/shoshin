import React, { useState } from 'react';
import FullArtBackground from '../layout/FullArtBackground';
import { Opponent, OnlineOpponent } from '../layout/SceneSelector';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
} from '@mui/material';
import OnlineTable from './OnlineTable';
import { JessicaOpponents } from '../ChooseOpponent/opponents/opponents';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import SubmitMenu from './SubmitMenu';

interface OnlineMenuProps {
    transitionBack: () => void;
    transitionFromOnlineMenu: (opp: OnlineOpponent) => void;
}

const ShimmedOnlineOpponents: OnlineOpponent[] = JessicaOpponents.map(
    (opp, index) => {
        return {
            agent: opp.agent as any,
            mindName: opp.mindName,
            playerName: opp.mindName,
        };
    }
);

const OnlineMenu = React.forwardRef<HTMLDivElement, OnlineMenuProps>(
    ({ transitionBack, transitionFromOnlineMenu }, ref) => {
        const [selectedOpponent, selectOpponent] = useState<number>(-1);

        const handleFightClick = () => {
            transitionFromOnlineMenu(ShimmedOnlineOpponents[selectedOpponent]);
        };

        const [isSubmitOpeoned, setOpenSubmit] = useState<boolean>(false);

        const toggleMenu = () => {
            setOpenSubmit(!isSubmitOpeoned);
        };
        const handleCardClick = (event) => {
            // Prevent the click event from propagating to the parent elements
            event.stopPropagation();
        };
        return (
            <div ref={ref}>
                <FullArtBackground useAlt={true}>
                    {isSubmitOpeoned && (
                        <div className={'overlay-menu'} onClick={toggleMenu}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Card onClick={handleCardClick}>
                                    <CardContent>
                                        <SubmitMenu closeMenu={toggleMenu} />
                                    </CardContent>
                                </Card>
                            </Box>
                        </div>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '60%',
                            height: '100vh',
                        }}
                    >
                        <Typography variant="h3" gutterBottom>
                            Online Opponents
                        </Typography>
                        <Box maxHeight={'60vh'} width={'100%'}>
                            <OnlineTable
                                opponents={ShimmedOnlineOpponents}
                                selectedOpponent={selectedOpponent}
                                selectOpponent={selectOpponent}
                            />
                        </Box>
                        <Button variant={'text'} onClick={toggleMenu}>
                            <Typography variant={'h6'}>
                                + Submit Mind
                            </Typography>
                        </Button>
                    </Box>
                    <Grid container>
                        <Grid item xs={9} />
                        <Grid item xs={3}>
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
                                    disabled={selectedOpponent === -1}
                                >
                                    Fight
                                </ShoshinMenuButton>
                            </Box>
                        </Grid>
                    </Grid>
                </FullArtBackground>
            </div>
        );
    }
);

export default OnlineMenu;
