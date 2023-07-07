import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const ShoshinMenuButton = styled(Button)<ButtonProps>(({ theme }) => ({
    border: '1px solid black',
    boxShadow: 'none',
    borderWidth: '0',
    borderImage: 'url(/images/ui/shoshin-button.png)',
    borderImageWidth: '24px 19.5px 22px 79.5px',
    borderImageSlice: '48 39 44 159 fill',
    borderImageRepeat: 'repeat',
    color: 'white',
    padding: '16px',
    '&.Mui-disabled': {
        color: theme.palette.grey[500],
    },
    '&:hover': {
        borderImageSource: 'url(/images/ui/shoshin-button-hover.png)',
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
    },
}));

export default ShoshinMenuButton;
