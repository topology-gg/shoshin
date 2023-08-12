import React, { useState } from 'react';
import styles from './SuccessMenu.module.css';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Medal } from '../../types/Opponent';
import FastForwardIcon from '@mui/icons-material/FastForward';
import ReplayIcon from '@mui/icons-material/Replay';
import { SCORING, ScoreMap, nullScoreMap } from '../../constants/constants';

const scoreRow = (
    scoreName: string,
    scoreAmount: number,
    isLast: boolean,
    isBonus: boolean = false
) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                borderTop: isLast ? '1px solid #555' : '',
                justifyContent: 'space-between',
                alignItems: 'baseline',
            }}
        >
            <span
                style={{
                    width: '170px',
                    textAlign: 'left',

                    color: isBonus ? '#FC5954' : 'inherit',
                }}
            >
                {scoreName}
            </span>
            <span
                style={{
                    width: '100px',
                    textAlign: 'right',
                    color: isBonus ? '#FC5954' : 'inherit',
                }}
            >
                {scoreAmount}
            </span>
        </div>
    );
};

const itemizedOffenseRow = (
    itemName: string,
    itemCount: number,
    itemScore: number
) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '20px',
                justifyContent: 'space-between',
                alignItems: 'baseline', // To align item count based on first letter
            }}
        >
            <span style={{ width: '170px', textAlign: 'left' }}>
                {itemCount} {itemName} for {itemScore}
            </span>
            <span style={{ width: '100px', textAlign: 'right' }}>
                {itemCount * itemScore}
            </span>
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
    const hurtCount = scoreMap.labor.hurt / SCORING.S_HURT;
    const knockCount = scoreMap.labor.knocked / SCORING.S_KNOCK;
    const launchCount = scoreMap.labor.launched / SCORING.S_LAUNCH;
    const koCount = scoreMap.labor.ko / SCORING.S_KO;
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
                        {scoreRow(
                            'Strikes',
                            scoreMap.labor.hurt +
                                scoreMap.labor.knocked +
                                scoreMap.labor.ko +
                                scoreMap.labor.launched,
                            false
                        )}
                        {hurtCount > 0 &&
                            itemizedOffenseRow(
                                'Hits',
                                hurtCount,
                                SCORING.S_HURT
                            )}
                        {knockCount > 0 &&
                            itemizedOffenseRow(
                                'Knockdowns',
                                knockCount,
                                SCORING.S_KNOCK
                            )}
                        {launchCount > 0 &&
                            itemizedOffenseRow(
                                'Launches',
                                launchCount,
                                SCORING.S_LAUNCH
                            )}
                        {koCount > 0 &&
                            itemizedOffenseRow('KO', koCount, SCORING.S_KO)}
                        {scoreMap.healthBonus > 0 &&
                            scoreRow('Dominance', scoreMap.healthBonus, false)}
                        {scoreMap.timeBonus > 0 &&
                            scoreRow('Haste', scoreMap.timeBonus, false)}
                        {scoreMap.fullHealthBonus > 0 &&
                            scoreRow(
                                'Untouchable',
                                scoreMap.fullHealthBonus,
                                false,
                                true
                            )}
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
