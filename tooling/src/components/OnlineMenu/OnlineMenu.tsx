import React, { useState } from 'react';
import FullArtBackground from '../layout/FullArtBackground';
import { Opponent, OnlineOpponent } from '../layout/SceneSelector';
import { Box, Button, Grid, Typography } from '@mui/material';
import OnlineTable from './OnlineTable';
import { JessicaOpponents } from '../ChooseOpponent/opponents/opponents';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';

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
        return (
            <div ref={ref}>
                <FullArtBackground useAlt={true}>
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
                        <Button variant={'text'}>
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
