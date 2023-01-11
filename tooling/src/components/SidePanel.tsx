import React from 'react';
import { Box } from "@mui/material";
import Tabs from './Tabs';
import MentalStates from './MentalStates';
import TreeEditor from './TreeEditor';
import GeneralFunctions from './GeneralFunctions';
    

const SidePanel = ({
    workingTab, handleClickTab, mentalStates, handleAddMentalState, handleClickRemoveMentalState, 
    treeEditor, handleClickTreeEditor, trees, handleUpdateTree, functions, handleUpdateGeneralFunction,
    handleConfirmFunction, functionsIndex, setFunctionsIndex, isWarningTextOn
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
                    indexTree={ treeEditor-1 }
                    tree={trees[treeEditor - 1]} 
                    handleUpdateTree={handleUpdateTree}
                    mentalState={mentalStates[treeEditor - 1]}
                    handleClickTreeEditor={handleClickTreeEditor}
                />
            }
            case 1: {
                return <GeneralFunctions
                        functions={functions}
                        handleUpdateGeneralFunction={handleUpdateGeneralFunction}
                        handleConfirmFunction={handleConfirmFunction}
                        functionsIndex={functionsIndex}
                        setFunctionsIndex={setFunctionsIndex}
                        isWarningTextOn={isWarningTextOn}
                />;
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
            <Tabs workingTab={workingTab} handleClickTab={handleClickTab}></Tabs>
            {content(workingTab)}
        </Box>
    )
}

export default SidePanel;