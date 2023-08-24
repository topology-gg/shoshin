import { Box, Grid, Typography } from '@mui/material';
import FullArtBackground from '../layout/FullArtBackground';
import Leaderboard from './Leaderboard';

const LeadboardScene = () => {
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
                                opponents={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </FullArtBackground>
        </div>
    );
};

export default LeadboardScene;
