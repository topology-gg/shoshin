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
import { LeaderboardScore } from './TopScores';
import { Character } from '../../constants/constants';
import {
    AntocOnlineOpponents,
    JessicaOnlineOpponents,
} from '../ChooseOpponent/opponents/opponents';

interface ScoreDetailProps {
    score: LeaderboardScore;
    onScoreClick: (index: string, opponentIndex: number) => void;
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
            const opponentName =
                score.character == Character.Jessica
                    ? JessicaOnlineOpponents[score.opponentIndex].mindName
                    : AntocOnlineOpponents[score.opponentIndex].mindName;

            return (
                <TableRow
                    key={index}
                    hover={true}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleScoreClick(index, score.opponentIndex)}
                >
                    <TableCell sx={{ ...tableCellSx, textAlign: 'center' }}>
                        {opponentName}
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
                        <TableCell sx={tableCellSx}>Opponent Name</TableCell>
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