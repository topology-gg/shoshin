import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import { useGetScoresForOpponents } from '../../../lib/api';
import { SinglePlayerScore } from '../ChooseOpponent/ScoreDisplay';
import { Character } from '../../constants/constants';
import React from 'react';
import ScoreDetail from './ScoreDetail';

interface LeaderboardProps {
    opponents: number[];
}

interface LeaderboardScore {
    playerAddress: string;
    totalScore: number;
    topScores: SinglePlayerScore[];
    scores: SinglePlayerScore[];
}
const Leaderboard = ({ opponents }: LeaderboardProps) => {
    const { data: data } = useGetScoresForOpponents(opponents);
    const scores = data?.scores ? data.scores : [];

    const highScores: LeaderboardScore[] = (
        scores as SinglePlayerScore[]
    ).reduce((acc, score) => {
        const index = acc.findIndex(
            (s) => s.playerAddress === score.playerAddress
        );

        if (index !== -1) {
            const existingScore = acc[index].scores.find(
                (existingScore) =>
                    existingScore.opponentIndex === score.opponentIndex
            );

            if (
                existingScore &&
                existingScore.score.totalScore < score.score.totalScore
            ) {
                acc[index].totalScore -= existingScore.score.totalScore;
                acc[index].totalScore += score.score.totalScore;
                acc[index].topScores = acc[index].topScores.map((s) => {
                    if (score.opponentIndex === s.opponentIndex) {
                        score;
                    }
                    return s;
                });
            } else if (!existingScore) {
                acc[index].totalScore += score.score.totalScore;
                acc[index].topScores.push(score);
            }

            acc[index].scores.push(score);
        } else {
            acc.push({
                playerAddress: score.playerAddress,
                totalScore: score.score.totalScore,
                scores: [score],
                topScores: [score],
            });
        }

        return acc;
    }, []);

    //Todo map address to Names

    const sortedScores = highScores.sort((a, b) => b.totalScore - a.totalScore);

    const tableCellSx = {
        fontSize: '14px',
    };

    console.log('sorted scores', sortedScores, scores);
    const scoreRows = (sortedScores as LeaderboardScore[]).map(
        (score, index) => {
            const copyAddress = () => {
                navigator.clipboard.writeText(score.playerAddress);
            };

            const characterCounts = score.topScores.reduce(
                (acc, score) => {
                    if (score.character == Character.Jessica) {
                        return {
                            ...acc,
                            jessica: acc.jessica + 1,
                        };
                    } else {
                        return {
                            ...acc,
                            antoc: acc.antoc + 1,
                        };
                    }
                },
                { jessica: 0, antoc: 0 }
            );

            let character = 'Both';
            if (characterCounts.jessica == 0) {
                character = 'Antoc';
            } else if (characterCounts.antoc == 0) {
                character = 'Jessica';
            }

            return (
                <TableRow
                    key={index}
                    hover={true}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleScoreClick(index)}
                >
                    <TableCell sx={{ ...tableCellSx, textAlign: 'center' }}>
                        {index + 1}
                    </TableCell>
                    <TableCell sx={tableCellSx}>{score.totalScore}</TableCell>
                    <TableCell sx={tableCellSx}>{character}</TableCell>
                    <TableCell sx={tableCellSx}>
                        <Tooltip title={`Click to copy ${score.playerAddress}`}>
                            <Box
                                textOverflow={'ellipsis'}
                                overflow={'hidden'}
                                width={'200px'}
                                onClick={copyAddress}
                            >
                                {score.playerAddress}
                            </Box>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            );
        }
    );

    const [openSelectScore, setOpenSelectScore] = React.useState(false);
    const [selectedScore, setSelectedScore] = React.useState<number>(0);

    const handleScoreClick = (index: number) => {
        setSelectedScore(index);
        setOpenSelectScore(true);
    };
    return (
        <Box>
            <Dialog
                open={openSelectScore}
                onClose={() => setOpenSelectScore(false)}
                fullWidth={true}
                maxWidth={'lg'}
            >
                <DialogTitle>
                    {sortedScores.length
                        ? sortedScores[selectedScore].playerAddress
                        : ''}
                </DialogTitle>
                <DialogContent>
                    <ScoreDetail score={sortedScores[selectedScore]} />
                </DialogContent>
            </Dialog>

            <TableContainer sx={{ overflowX: 'initial' }} component={Paper}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={tableCellSx}>Rank</TableCell>
                            <TableCell sx={tableCellSx}>Total Score</TableCell>
                            <TableCell sx={tableCellSx}>Character</TableCell>
                            <TableCell sx={tableCellSx}>Player</TableCell>
                        </TableRow>
                    </TableHead>
                    {data?.scores == undefined ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>{scoreRows}</TableBody>
                    )}
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Leaderboard;
