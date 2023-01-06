import React from 'react';
import { Box } from "@mui/material";
import Tabs from './Tabs';
import MentalStates from './MentalStates';
import TreeEditor from './TreeEditor';
import GeneralFunctions from './GeneralFunctions';
    

const SidePanel = ({
    workingTab, handleClickTab, mentalStates, handleAddMentalState, handleClickRemoveMentalState, 
    treeEditor, handleClickTreeEditor
}) => {
    const content = (workingTab: number) => {
        switch (workingTab) {
            case 0: {
                return !treeEditor && <MentalStates 
                    mentalStates={mentalStates}
                    handleAddMentalState={handleAddMentalState} 
                    handleClickRemoveMentalState={handleClickRemoveMentalState}
                    handleClickTreeEditor={handleClickTreeEditor} 
                /> || !!treeEditor && <TreeEditor 
                    tree={treeEditor} 
                    handleClickTreeEditor={handleClickTreeEditor}
                />
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