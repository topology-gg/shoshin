import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const Tile = styled(Card)(({ theme }) => ({
    border: '1px solid black',
    boxShadow: 'none',
}));

export default Tile;
