import { Card, CardContent, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface TileProps extends CardProps {
    active?: boolean;
}

const Tile = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'active',
})<TileProps>(({ theme, active }) => ({
    border: '1px solid black',
    boxShadow: 'none',
    ...(active && {
        backgroundColor: '#717171',
        color: '#ffffff',
    }),
}));

export const TileContent = styled(CardContent)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

export default Tile;
