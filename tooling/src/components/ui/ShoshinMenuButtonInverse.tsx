import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ShoshinMenuButtonProps {
    isAlt?: boolean;
}
const ShoshinMenuButtonInverse = styled(Button)<ShoshinMenuButtonProps>(
    ({ theme, isAlt = false }) => ({
        border: '1px solid black',
        boxShadow: 'none',
        borderWidth: '0',
        borderImage: isAlt
            ? 'url(/images/ui/shoshin-button-alt.png)'
            : 'url(/images/ui/shoshin-button-hover.png)',
        ...(isAlt
            ? {
                  borderImageWidth: '23px 79px 17px 80px',
                  borderImageSlice: '23 79 17 80 fill',
              }
            : {
                  borderImageWidth: '24px 19.5px 22px 79.5px',
                  borderImageSlice: '48 39 44 159 fill',
              }),
        borderImageRepeat: 'repeat',
        color: 'black',
        padding: '16px',
        fontFamily: 'Dela Gothic One',
        '&.Mui-disabled': {
            color: theme.palette.grey[500],
        },
        ...(!isAlt && {
            '&:hover': {
                borderImageSource: 'url(/images/ui/shoshin-button.png)',
                backgroundColor: 'transparent',
                color: 'white',
            },
        }),
    })
);

export default ShoshinMenuButtonInverse;
