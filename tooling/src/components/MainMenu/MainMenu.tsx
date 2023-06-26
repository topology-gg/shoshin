import {
    Box,
    Button,
    MenuItem,
    Select,
    Typography,
    styled,
} from '@mui/material';
import styles from './MainMenu.module.css';

const MainMenu = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <Typography variant="h4" gutterBottom>
                Shoshin
            </Typography>
            <Button
                variant="text"
                className={styles.MenuButton}
                color="primary"
                size="large"
            >
                Play
            </Button>
            <Button
                variant="text"
                className={styles.MenuButton}
                color="primary"
                size="large"
                fullWidth
                disabled={true}
            >
                Arcade Mode
            </Button>
            <Button
                variant="text"
                className={styles.MenuButton}
                color="primary"
                size="large"
                fullWidth
                disabled={true}
            >
                About Shoshin
            </Button>
            <Button
                variant="text"
                className={styles.MenuButton}
                color="primary"
                size="large"
                fullWidth
                disabled={true}
            >
                Profile
            </Button>
            <Button
                variant="text"
                className={styles.MenuButton}
                color="primary"
                size="large"
                fullWidth
                disabled={true}
            >
                Settings
            </Button>
        </Box>
    );
};

export default MainMenu;
