import React, { useState } from 'react';
import styles from './SuccessMenu.module.css';
import { Box, Button, Typography } from '@mui/material';
import { Medal } from '../layout/SceneSelector';

interface SquareOverlayMenu {
    opponentName: string;
    performance: Medal;
    handleContinueClick: () => void;
}
const SquareOverlayMenu = ({
    opponentName,
    performance,
    handleContinueClick,
}: SquareOverlayMenu) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={'overlay-menu'} onClick={toggleMenu}>
            <div className={styles.menuContent}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        You defeated {opponentName}
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        Grade: {performance}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleContinueClick}
                    >
                        Continue
                    </Button>
                </Box>
            </div>
        </div>
    );
};

export default SquareOverlayMenu;
