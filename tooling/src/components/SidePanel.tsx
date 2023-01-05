import React from 'react';
import { Box } from "@mui/material";
import Tabs from './Tabs';
    

const SidePanel = (handleClickTab) => {

    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            p: "1rem",
        }}>
            <Tabs handleClickTab={handleClickTab}></Tabs>
        </Box>
    )
}

export default SidePanel;