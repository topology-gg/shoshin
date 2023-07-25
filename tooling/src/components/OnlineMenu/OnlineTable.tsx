import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { OnlineOpponent, Opponent } from '../layout/SceneSelector';
import { Character } from '../../constants/constants';

interface OnlineTableProps {
    opponents: OnlineOpponent[];
    selectedOpponent: number;
    selectOpponent: (index: number) => void;
}
const OnlineTable = ({
    opponents,
    selectOpponent,
    selectedOpponent,
}: OnlineTableProps) => {
    const opponentRows = opponents.map((opp, index) => (
        <TableRow
            key={index}
            onClick={() => selectOpponent(index)}
            style={{ cursor: 'pointer' }}
            selected={index === selectedOpponent}
        >
            <TableCell>{opp.mindName}</TableCell>
            <TableCell>{opp.playerName}</TableCell>
            <TableCell>{opp.agent.character}</TableCell>
        </TableRow>
    ));

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Creator</TableCell>
                        <TableCell>Character</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{opponentRows}</TableBody>
            </Table>
        </TableContainer>
    );
};

export default OnlineTable;
