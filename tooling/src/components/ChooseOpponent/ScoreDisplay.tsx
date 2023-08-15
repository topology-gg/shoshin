import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
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
            playerAddress:
                '0x0266eD55Be7054c74Db3F8Ec2E79C728056C802a11481fAD0E91220139B8916A',
            character: Character.Jessica,
            score: {
                totalScore: 100,
            },
        },
        {
            playerAddress:
                '0x0266eD55Be7054c74Db3F8Ec2E79C728056C802a11481fAD0E91220139B8916A',
            character: Character.Jessica,
            score: {
                totalScore: 100,
            },
        },
        {
            playerAddress:
                '0x0266eD55Be7054c74Db3F8Ec2E79C728056C802a11481fAD0E91220139B8916A',
            character: Character.Jessica,
            score: {
                totalScore: 100,
            },
        },
        {
            playerAddress:
                '0x0266eD55Be7054c74Db3F8Ec2E79C728056C802a11481fAD0E91220139B8916A',
            character: Character.Jessica,
            score: {
                totalScore: 100,
            },
        },
    ];
    if (scores === undefined) {
        return <CircularProgress />;
    }

    const tableCellSx = {
        fontSize: '14px',
    };

    const scoreRows = (scores as SinglePlayerScore[]).map((score, index) => {
        const copyAddress = () => {
            navigator.clipboard.writeText(score.playerAddress);
        };
        return (
            <TableRow key={index} hover={true} style={{ cursor: 'pointer' }}>
                <TableCell sx={tableCellSx}>{score.score.totalScore}</TableCell>
                <TableCell sx={tableCellSx}>
                    <Tooltip title={`Click to copy ${score.playerAddress}`}>
                        <Box
                            textOverflow={'ellipsis'}
                            overflow={'hidden'}
                            width={'300px'}
                            onClick={copyAddress}
                        >
                            {score.playerAddress}
                        </Box>
                    </Tooltip>
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
