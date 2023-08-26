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

    const mapped = Object.entries(records ? records : {}).map(
        ([player, result]) => ({
            player,
            result,
        })
    );

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

    if (recordRows.length === 0) {
        return (
            <Box display={'flex'} alignItems={'center'}>
                <Typography variant="h6">No Match History Available</Typography>
            </Box>
        );
    }
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
