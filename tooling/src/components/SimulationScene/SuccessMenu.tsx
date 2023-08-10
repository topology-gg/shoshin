import React, { useState } from 'react';
import styles from './SuccessMenu.module.css';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Medal } from '../../types/Opponent';

interface SquareOverlayMenu {
    opponentName: string;
    performance: Medal;
    handleContinueClick: () => void;
    closeMenu: () => void;
}
const SquareOverlayMenu = ({
    opponentName,
    performance,
    handleContinueClick,
    closeMenu,
}: SquareOverlayMenu) => {
    return (
        <div className={'overlay-menu'}>
            <div className={styles.menuContent}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        You defeated {opponentName}
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        Grade: {performance}
                    </Typography>
                    <Stack spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleContinueClick}
                        >
                            Next Opponent
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={closeMenu}
                        >
                            Keep playing
                        </Button>
                    </Stack>
                </Box>
            </div>
        </div>
    );
};

export default SquareOverlayMenu;
