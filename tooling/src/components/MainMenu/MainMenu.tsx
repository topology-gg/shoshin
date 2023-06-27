import { Box, Button, Typography } from '@mui/material';
import styles from './MainMenu.module.css';
import { GameModes } from '../../types/Simulator';

const MainMenu = ({ transition }) => {
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
                onClick={() => transition(GameModes.simulation)}
            >
                Play
            </Button>
            <Button
                variant="text"
                className={styles.MenuButton}
                color="primary"
                size="large"
                fullWidth
                onClick={() => transition(GameModes.realtime)}
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
