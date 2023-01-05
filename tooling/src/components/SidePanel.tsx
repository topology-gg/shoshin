import * as React from 'react';
import { Box } from "@mui/material";
import Tabs from './Tabs';

const SidePanel = () => {
    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            width: "25rem",
            p: "1rem",
        }}>
            <Tabs></Tabs>
        </Box>
    )
}

export default SidePanel;