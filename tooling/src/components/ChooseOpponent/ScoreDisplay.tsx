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
import { useGetScoresForOpponents } from '../../../lib/api';
import { useAccount } from '@starknet-react/core';
import { Character, ScoreMap, WhitelistEntry } from '../../constants/constants';
import { useGetScoresForOpponent, useWhitelist } from '../../../lib/api';

interface ScoreDisplayProps {
    opponentIndex: number;
}

export interface SinglePlayerScore {
    playerAddress: string;
    mindId: string;
    character: Character;
    score: ScoreMap;
    opponentIndex: number;
}
const ScoreDisplay = ({ opponentIndex }: ScoreDisplayProps) => {
    const { data: data } = useGetScoresForOpponents([opponentIndex], 20);
    const scores = data?.scores ? data.scores : [];

    const { data: whitelistData } = useWhitelist();

    const tableCellSx = {
        fontSize: '14px',
    };

    const scoreRows = (scores as SinglePlayerScore[]).map((score, index) => {
        const copyAddress = () => {
            navigator.clipboard.writeText(score.playerAddress);
        };

        const whitelistEntry = (
            whitelistData ? whitelistData : ([] as WhitelistEntry[])
        ).find((entry) => entry.address == score.playerAddress);
        let identifier = whitelistEntry
            ? whitelistEntry.username
            : score.playerAddress;

        return (
            <TableRow key={index} hover={true} style={{ cursor: 'pointer' }}>
                <TableCell sx={{ ...tableCellSx, textAlign: 'center' }}>
                    {index + 1}
                </TableCell>
                <TableCell sx={tableCellSx}>{score.score.totalScore}</TableCell>
                <TableCell sx={tableCellSx}>
                    <Tooltip title={`Click to copy ${score.playerAddress}`}>
                        <Box
                            textOverflow={'ellipsis'}
                            overflow={'hidden'}
                            width={'200px'}
                            onClick={copyAddress}
                        >
                            {identifier}
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
                        <TableCell sx={tableCellSx}>Rank</TableCell>
                        <TableCell sx={tableCellSx}>Score</TableCell>
                        <TableCell sx={tableCellSx}>Submitted by</TableCell>
                        <TableCell sx={tableCellSx}>Character</TableCell>
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
    );
};

export default ScoreDisplay;
