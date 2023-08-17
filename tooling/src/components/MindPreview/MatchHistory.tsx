import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { PvPResult } from '../../helpers/pvpHelper';

interface MatchHistoryProps {
    records: Map<string, PvPResult>;
}

const tableCellSx = { fontSize: '14px' };

const MatchHistory = ({ records }: MatchHistoryProps) => {
    let index = 0;

    console.log('records', records);

    const mapped = Object.entries(records).map(([player, result]) => ({
        player,
        result,
    }));

    console.log('mapped', mapped);
    const recordRows = mapped.map((record, index) => {
        index = index + 1;

        return (
            <TableRow key={index}>
                <TableCell sx={tableCellSx}>{record.result.result}</TableCell>
                <TableCell sx={tableCellSx}>{record.player}</TableCell>
                <TableCell sx={tableCellSx}>{record.result.hp}</TableCell>
            </TableRow>
        );
    });

    return (
        <TableContainer sx={{ overflowX: 'initial' }} component={Paper}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={tableCellSx}>Result</TableCell>
                        <TableCell sx={tableCellSx}>Opponent</TableCell>
                        <TableCell sx={tableCellSx}>Remaining HP</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{recordRows}</TableBody>
            </Table>
        </TableContainer>
    );
};

export default MatchHistory;
