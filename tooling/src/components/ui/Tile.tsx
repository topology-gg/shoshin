import {
    Card,
    CardContent,
    CardMedia,
    CardMediaProps,
    CardProps,
} from '@mui/material';
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
    '&:hover': {
        '.MuiCardMedia-root': {
            backgroundImage: 'var(--hover-image)',
        },
    },
}));

export const TileContent = styled(CardContent)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

export interface TileImageProps extends CardMediaProps {
    hoverImage?: string;
}

export const TileImage = styled(CardMedia, {
    shouldForwardProp: (prop) => prop !== 'hoverImage' && prop !== 'image',
})<TileImageProps>(({ image, hoverImage }) => ({
    '--hover-image': `url(${hoverImage ?? image})`,
    ...(image && {
        backgroundImage: `url(${image})`,
    }),
    ...(hoverImage && {
        '&:hover': {
            backgroundImage: `url(${hoverImage})`,
        },
    }),
}));

export default Tile;
