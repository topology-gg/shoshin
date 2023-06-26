import { Box, Typography } from '@mui/material';
import styles from './menu.module.css';
const TitleMenu = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Shoshin
            </Typography>
            <Typography component="h1" gutterBottom color="textSecondary">
                Press any key to continue
            </Typography>
            <video
                className={styles.backgroundVideo}
                autoPlay
                loop
                muted
                src="media/fight-intro.mp4"
            ></video>
        </Box>
        /*  */
    );
};

export default TitleMenu;
