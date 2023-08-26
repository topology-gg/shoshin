import React, { useState } from 'react';
import styles from './SuccessMenu.module.css';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Medal } from '../../types/Opponent';
import FastForwardIcon from '@mui/icons-material/FastForward';
import ReplayIcon from '@mui/icons-material/Replay';
import { SCORING, ScoreMap, nullScoreMap } from '../../constants/constants';
import ScoreCount from './ScoreCount';

interface SquareOverlayMenu {
    opponentName: string;
    performance: Medal;
    scoreMap: ScoreMap;
    handleContinueClick: () => void;
    closeMenu: () => void;
}
const SquareOverlayMenu = ({
    opponentName,
    performance,
    handleContinueClick,
    closeMenu,
    scoreMap,
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
                    <ScoreCount
                        opponentName={opponentName}
                        scoreMap={scoreMap}
                        performance={performance}
                    />
                    <Stack spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleContinueClick}
                        >
                            <FastForwardIcon sx={{ mr: '4px' }} /> Next Opponent
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={closeMenu}
                        >
                            <ReplayIcon sx={{ mr: '4px' }} /> Keep playing
                        </Button>
                    </Stack>
                </Box>
            </div>
        </div>
    );
};

export default SquareOverlayMenu;
