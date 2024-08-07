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
import { OnlineOpponent } from '../../types/Opponent';

interface OnlineTableProps {
    isLocal?: boolean;
    opponents: OnlineOpponent[];
    selectedOpponent: number;
    selectOpponent: (index: number) => void;
    displayRank: boolean;
}
const OnlineTable = ({
    isLocal,
    opponents,
    selectOpponent,
    selectedOpponent,
    displayRank,
}: OnlineTableProps) => {
    if (opponents === undefined) {
        return <CircularProgress />;
    }

    const tableCellSx = { fontSize: '14px' };

    const opponentRows = opponents.map((opp, index) => (
        <TableRow
            key={index}
            hover={true}
            onClick={() => selectOpponent(index)}
            style={{ cursor: 'pointer' }}
            selected={index === selectedOpponent}
        >
            {displayRank && <TableCell sx={tableCellSx}>{opp.rank}</TableCell>}

            <TableCell sx={tableCellSx}>{opp.mindName}</TableCell>
            <TableCell sx={tableCellSx}>{opp.playerName}</TableCell>
            <TableCell sx={tableCellSx}>{opp.agent.character}</TableCell>
        </TableRow>
    ));

    return (
        <TableContainer sx={{ overflowX: 'initial' }} component={Paper}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        {displayRank && (
                            <TableCell sx={tableCellSx}>Rank</TableCell>
                        )}
                        <TableCell sx={tableCellSx}>Name</TableCell>
                        <TableCell sx={tableCellSx}>Creator</TableCell>
                        <TableCell sx={tableCellSx}>Character</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{opponentRows}</TableBody>
            </Table>
        </TableContainer>
    );
};

export default OnlineTable;
