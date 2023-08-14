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
import CardSimple from '../ui/CardSimple';
import { EMPTY_JESSICA } from '../../constants/starter_agent';
import { PlayerAgent } from '../../types/Agent';
import { Character, JESSICA, ScoreMap } from '../../constants/constants';
import { useGetScoresForOpponent } from '../../../lib/api';

interface ScoreDisplayProps {
    opponentIndex: number;
}

export interface SinglePlayerScore {
    playerAddress: string;
    character: Character;
    score: ScoreMap;
    scoreIndex: number;
}
const ScoreDisplay = ({ opponentIndex }: ScoreDisplayProps) => {
    //const { data: data } = useGetScoresForOpponent(scoreIndex);
    //const scores = data?.scores;

    const scores = [
        {
            playerAddress: '0x123',
            character: Character.Jessica,
            score: {
                totalScore: 100,
            },
        },
        {
            playerAddress: '0x123',
            character: Character.Jessica,
            score: {
                totalScore: 100,
            },
        },
        {
            playerAddress: '0x123',
            character: Character.Jessica,
            score: {
                totalScore: 100,
            },
        },
        {
            playerAddress: '0x123',
            character: Character.Jessica,
            score: {
                totalScore: 100,
            },
        },
    ];
    if (scores === undefined) {
        return <CircularProgress />;
    }

    const tableCellSx = { fontSize: '14px' };

    const scoreRows = (scores as SinglePlayerScore[]).map((score, index) => (
        <TableRow key={index} hover={true} style={{ cursor: 'pointer' }}>
            <TableCell sx={tableCellSx}>{score.score.totalScore}</TableCell>
            <TableCell sx={tableCellSx}>{score.playerAddress}</TableCell>
            <TableCell sx={tableCellSx}>{score.character}</TableCell>
        </TableRow>
    ));

    return (
        <TableContainer sx={{ overflowX: 'initial' }} component={Paper}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={tableCellSx}>Score</TableCell>
                        <TableCell sx={tableCellSx}>Submitted by</TableCell>
                        <TableCell sx={tableCellSx}>Character</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{scoreRows}</TableBody>
            </Table>
        </TableContainer>
    );
};

export default ScoreDisplay;
