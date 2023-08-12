import React, { useState } from 'react';
import styles from './SuccessMenu.module.css';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Medal } from '../../types/Opponent';
import FastForwardIcon from '@mui/icons-material/FastForward';
import ReplayIcon from '@mui/icons-material/Replay';
import { ScoreMap } from '../../constants/constants';

const scoreRow = (scoreName: string, scoreAmount: number, isLast: boolean) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                borderTop: isLast ? '1px solid #555' : '',
            }}
        >
            <span style={{ width: '170px' }}>{scoreName}</span>
            <span style={{ width: '100px' }}>{scoreAmount}</span>
        </div>
    );
};

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
                    <Typography variant="h4" align="center" gutterBottom>
                        You defeated {opponentName}
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        Grade: {performance}
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        sx={{ mb: 3 }}
                    >
                        Score
                        {scoreRow('Labor Points', scoreMap.laborPoints, false)}
                        {scoreRow('Health Bonus', scoreMap.healthBonus, false)}
                        {scoreRow(
                            'Full Health Bonus',
                            scoreMap.fullHealthBonus,
                            false
                        )}
                        {scoreRow('Time Bonus', scoreMap.timeBonus, false)}
                        {scoreRow('Total', scoreMap.totalScore, true)}
                    </Typography>
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
