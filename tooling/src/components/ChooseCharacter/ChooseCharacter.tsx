import React from 'react';

import { Box, Button, CardActionArea, Typography } from '@mui/material';
import { Character } from '../../constants/constants';
import Tile, { TileContent } from '../ui/Tile';

const ChooseCharacter = React.forwardRef<
    HTMLDivElement,
    {
        transitionChooseOpponent: (character: Character) => void;
        jessicaProgress: number;
        antocProgress: number;
        antocGoldCount: number;
        jessicaGoldCount: number;
        opponentCount: number;
    }
>(
    (
        {
            transitionChooseOpponent,
            jessicaProgress,
            antocProgress,
            jessicaGoldCount,
            antocGoldCount,
            opponentCount,
        },
        ref
    ) => {
        const jessicaProgressStyle =
            jessicaProgress < 100 ? (
                <Typography variant="h6">
                    Progress {jessicaProgress}%
                </Typography>
            ) : (
                <Typography variant="h6">
                    Gold Medals {jessicaGoldCount}/{opponentCount}
                </Typography>
            );

        const antocProgressStyle =
            antocProgress < 100 ? (
                <Typography variant="h6">Progress {antocProgress}%</Typography>
            ) : (
                <Typography variant="h6">
                    Gold Medals {antocGoldCount}/{opponentCount}
                </Typography>
            );

        return (
            <div ref={ref}>
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
                    <Typography variant="h5" gutterBottom>
                        Choose your character
                    </Typography>

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={2}
                    >
                        <Tile sx={{ width: 400 }}>
                            <CardActionArea
                                onClick={() =>
                                    transitionChooseOpponent(Character.Jessica)
                                }
                            >
                                <TileContent>
                                    <Typography variant="h4">
                                        Jessica
                                    </Typography>
                                    <img
                                        src="images/jessica/idle/right/frame_0.png"
                                        alt="Image 1"
                                        height="200px"
                                    />
                                    {jessicaProgressStyle}
                                    <Typography variant="body2">
                                        Additional descriptive text
                                    </Typography>
                                </TileContent>
                            </CardActionArea>
                        </Tile>

                        <Tile sx={{ width: 400 }}>
                            <CardActionArea
                                onClick={() =>
                                    transitionChooseOpponent(Character.Antoc)
                                }
                            >
                                <TileContent>
                                    <Typography variant="h4">Antoc</Typography>
                                    <img
                                        src="images/antoc/idle/left/frame_0.png"
                                        alt="Image 2"
                                        height="220px"
                                        style={{
                                            objectFit: 'cover',
                                            marginTop: '-10px',
                                            marginBottom: '-10px',
                                        }}
                                    />
                                    {antocProgressStyle}
                                    <Typography variant="body2">
                                        Additional descriptive text
                                    </Typography>
                                </TileContent>
                            </CardActionArea>
                        </Tile>
                    </Box>
                    <Button variant="contained" sx={{ marginTop: '30px' }}>
                        Back
                    </Button>
                </Box>
            </div>
        );
    }
);

export default ChooseCharacter;
