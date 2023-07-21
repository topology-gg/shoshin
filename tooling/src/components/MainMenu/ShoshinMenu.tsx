import { Box } from '@mui/material';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import LogoBig from '../layout/LogoBig';

export interface ShoshinMenuItem {
    title: string;
    onClick?: (args?: string) => void;
}

interface ShoshinMenuProps {
    displayLogo: boolean;
    menuItems: ShoshinMenuItem[];
}
const ShoshinMenu = ({ displayLogo, menuItems }: ShoshinMenuProps) => {
    const buttons = menuItems.map((item) => {
        return (
            <ShoshinMenuButton
                variant="text"
                size="large"
                onClick={() =>
                    item.onClick !== undefined ? item.onClick() : {}
                }
                disabled={item.onClick !== undefined ? false : true}
            >
                {item.title}
            </ShoshinMenuButton>
        );
    });
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="30%"
            width="25%"
            mt={displayLogo ? 0 : 40}
        >
            {displayLogo && <LogoBig />}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {buttons}
            </Box>
        </Box>
    );
};

export default ShoshinMenu;
