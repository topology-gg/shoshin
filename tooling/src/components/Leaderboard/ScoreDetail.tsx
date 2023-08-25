import {
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { SinglePlayerScore } from '../ChooseOpponent/ScoreDisplay';

interface ScoreDetailProps {
    score: LeaderboardScore;
    onScoreClick: (index: string, opponentIndex: number) => void;
}

interface LeaderboardScore {
    playerAddress: string;
    totalScore: number;
    topScores: SinglePlayerScore[];
    scores: SinglePlayerScore[];
}

const ScoreDetail = ({ score, onScoreClick }: ScoreDetailProps) => {
    const handleScoreClick = (index, opponentIndex) => {
        onScoreClick(score.scores[index].mindId, opponentIndex);
    };

    const tableCellSx = {
        fontSize: '14px',
    };

    const rows = score.topScores
        .sort((a, b) => a.opponentIndex - b.opponentIndex)
        .map((score, index) => {
            return (
                <TableRow
                    key={index}
                    hover={true}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleScoreClick(index, score.opponentIndex)}
                >
                    <TableCell sx={{ ...tableCellSx, textAlign: 'center' }}>
                        {score.opponentIndex}
                    </TableCell>
                    <TableCell sx={tableCellSx}>
                        {score.score.totalScore}
                    </TableCell>
                    <TableCell sx={tableCellSx}>{score.character}</TableCell>
                </TableRow>
            );
        });

    return (
        <TableContainer sx={{ overflowX: 'initial' }} component={Paper}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={tableCellSx}>Opponent Id</TableCell>
                        <TableCell sx={tableCellSx}>Total Score</TableCell>
                        <TableCell sx={tableCellSx}>Character</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>{rows}</TableBody>
            </Table>
        </TableContainer>
    );
};

export default ScoreDetail;
