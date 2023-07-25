import React, { useState } from 'react';
import FullArtBackground from '../layout/FullArtBackground';
import { Opponent, OnlineOpponent } from '../layout/SceneSelector';
import { Box, Grid, Typography } from '@mui/material';
import OnlineTable from './OnlineTable';
import { JessicaOpponents } from '../ChooseOpponent/opponents/opponents';

interface OnlineMenuProps {
    transitionBack: () => void;
    transitionFromOnlineMenu: (opp: Opponent) => void;
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
                            Online Opponents
                        </Typography>
                        <OnlineTable
                            opponents={ShimmedOnlineOpponents}
                            selectedOpponent={selectedOpponent}
                            selectOpponent={selectOpponent}
                        />
                    </Box>
                </FullArtBackground>
            </div>
        );
    }
);

export default OnlineMenu;
