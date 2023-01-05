import React from 'react';
import { Box } from "@mui/material";
import Tabs from './Tabs';
import MentalStates from './MentalStates';
import GeneralFunctions from './GeneralFunctions';
    

const SidePanel = ({workingTab, handleClickTab, mentalStates, handleAddMentalState}) => {
    const content = (workingTab) => {
        switch (workingTab) {
            case 0: {
                return <MentalStates 
                    mentalStates={mentalStates}
                    handleAddMentalState={handleAddMentalState} 
                />;
            }
            case 1: {
                return <GeneralFunctions/>;
            }
        }
    }
    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            margin: "1rem",
        }}>
            <Tabs handleClickTab={handleClickTab}></Tabs>
            {content(workingTab)}
        </Box>
    )
}

export default SidePanel;