import { Box, Typography } from '@mui/material';
import { SCORING, ScoreMap } from '../../constants/constants';
import { Medal } from '../../types/Opponent';

interface ScoreCount {
    opponentName: string;
    scoreMap: ScoreMap;
    performance: Medal;
}

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

const ScoreCount = ({ scoreMap, opponentName, performance }: ScoreCount) => {
    const hurtCount = scoreMap.labor.hurt / SCORING.S_HURT;
    const knockCount = scoreMap.labor.knocked / SCORING.S_KNOCK;
    const launchCount = scoreMap.labor.launched / SCORING.S_LAUNCH;
    const koCount = scoreMap.labor.ko / SCORING.S_KO;

    return (
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
            <Typography variant="h6" align="center" gutterBottom sx={{ mb: 3 }}>
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
                    itemizedOffenseRow('Hits', hurtCount, SCORING.S_HURT)}
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
                {koCount > 0 && itemizedOffenseRow('KO', koCount, SCORING.S_KO)}
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
        </Box>
    );
};

export default ScoreCount;
