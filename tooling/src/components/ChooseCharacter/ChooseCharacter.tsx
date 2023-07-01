import React from 'react';

import {
    Box,
    Button,
    CardActionArea,
    CardContent,
    Typography,
} from '@mui/material';
import { Character } from '../../constants/constants';
import Tile from '../ui/Tile';

const ChooseCharacter = React.forwardRef<
    HTMLDivElement,
    { transitionChooseOpponent: (character: Character) => void }
>(({ transitionChooseOpponent }, ref) => {
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
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="h4">Jessica</Typography>
                                <img
                                    src="images/jessica/idle/right/frame_0.png"
                                    alt="Image 1"
                                    height="200px"
                                />
                                <Typography variant="h6">
                                    Progress 0%
                                </Typography>
                                <Typography variant="body2">
                                    Additional descriptive text
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Tile>

                    <Tile sx={{ width: 400 }}>
                        <CardActionArea
                            onClick={() =>
                                transitionChooseOpponent(Character.Antoc)
                            }
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
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
                                <Typography variant="h6">
                                    Progress 0%
                                </Typography>
                                <Typography variant="body2">
                                    Additional descriptive text
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Tile>
                </Box>
                <Button variant="contained" sx={{ marginTop: '30px' }}>
                    Back
                </Button>
            </Box>
        </div>
    );
});

export default ChooseCharacter;
