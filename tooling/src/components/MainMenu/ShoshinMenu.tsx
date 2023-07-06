import { Box, Button, Typography } from '@mui/material';
import styles from './MainMenu.module.css';
import { GameModes } from '../../types/Simulator';

export interface ShoshinMenuItem {
    title: string;
    onClick?: (args?: string) => void;
}

interface ShoshinMenuProps {
    menuTitle: string;
    menuItems: ShoshinMenuItem[];
}
const ShoshinMenu = ({ menuTitle, menuItems }: ShoshinMenuProps) => {
    const buttons = menuItems.map((item) => {
        return (
            <Button
                variant="text"
                className={styles.MenuButton}
                color="primary"
                size="large"
                onClick={() =>
                    item.onClick !== undefined ? item.onClick() : {}
                }
                disabled={item.onClick !== undefined ? false : true}
            >
                {item.title}
            </Button>
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
            bgcolor="white"
        >
            <Typography variant="h4" gutterBottom>
                {menuTitle}
            </Typography>
            {buttons}
        </Box>
    );
};

export default ShoshinMenu;
