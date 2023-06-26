import React, { useRef } from 'react';
import { Typography, Box } from '@mui/material';
import styles from './ChooseOpponent.module.css';

const ChooseOpponent = () => {
    const containerRef = useRef(null);

    const scrollToBox = (boxRef) => {
        boxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const characterBoxes = Array.from(Array(10).keys()).map((index) => {
        const boxRef = useRef(null);
        const handleClick = () => scrollToBox(boxRef);

        return (
            <Box
                key={index}
                ref={boxRef}
                className={styles.characterBox}
                onClick={handleClick}
            >
                <Typography variant="h4">Jessica</Typography>
                <img
                    src="images/jessica/idle/right/frame_0.png"
                    alt="Image 1"
                    height="200px"
                />
                <Typography variant="body2">
                    Additional descriptive text
                </Typography>
            </Box>
        );
    });

    return (
        <div className={styles.characterGrid} ref={containerRef}>
            {characterBoxes}
        </div>
    );
};

export default ChooseOpponent;
