import { Box, Grid, Typography } from '@mui/material';
import FullArtBackground from '../layout/FullArtBackground';
import { PlayerAgent } from '../../types/Agent';
import Leaderboard from './TopScores';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';

interface LeaderboardSceneProps {
    handleSelectReplay: (mind: PlayerAgent, opponentIndex: number) => void;
    transitionBack: () => void;
}

const LeadboardScene = ({
    handleSelectReplay,
    transitionBack,
}: LeaderboardSceneProps) => {
    return (
        <div>
            <FullArtBackground useAlt={true}>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                >
                    <Grid item xs={12} sm={10} md={8} lg={6}>
                        <Typography variant="h1">Leaderboard</Typography>
                        <Box
                            sx={{ overflowY: 'auto', marginBottom: '16px' }}
                            maxHeight={'80vh'}
                        >
                            <Leaderboard
                                handleSelectReplay={handleSelectReplay}
                                opponents={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={0} sm={2} md={4} lg={6}></Grid>
                    <Grid item xs={4}>
                        <ShoshinMenuButton
                            sx={{ width: 150 }}
                            disabled={false}
                            onClick={() => transitionBack()}
                        >
                            Back
                        </ShoshinMenuButton>
                    </Grid>
                </Grid>
            </FullArtBackground>
        </div>
    );
};

export default LeadboardScene;
