import React from 'react';
import styles from '../../styles/Home.module.css';
import { Box } from "@mui/material";
import Tabs from './Tabs';
import MentalStates from './MentalStates';
import TreeEditor from './TreeEditor';
import GeneralFunctions from './GeneralFunctions';
    

const SidePanel = ({
    workingTab, handleClickTab, mentalStates, combos, handleValidateCombo, character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, 
    handleSetMentalStateAction, treeEditor, handleClickTreeEditor, trees, handleUpdateTree, functions, handleUpdateGeneralFunction,
    handleConfirmFunction, handleClickDeleteFunction, functionsIndex, setFunctionsIndex, isGeneralFunctionWarningTextOn, generalFunctionWarningText, 
    isTreeEditorWarningTextOn, treeEditorWarningText, handleRemoveElementGeneralFunction, handleValidateCharacter
}) => {
    const content = (workingTab: number) => {
        switch (workingTab) {
            case 0: {
                return !treeEditor && <MentalStates 
                    mentalStates={mentalStates}
                    combos={combos}
                    handleValidateCombo={handleValidateCombo}
                    character={character}
                    setCharacter={setCharacter}
                    handleAddMentalState={handleAddMentalState} 
                    handleClickRemoveMentalState={handleClickRemoveMentalState}
                    handleSetMentalStateAction={handleSetMentalStateAction}
                    handleClickTreeEditor={handleClickTreeEditor} 
                /> || !!treeEditor && <TreeEditor 
                    indexTree={ treeEditor - 1 }
                    tree={trees[treeEditor - 1]} 
                    handleUpdateTree={handleUpdateTree}
                    mentalStates={mentalStates}
                    functions={functions}
                    handleClickTreeEditor={handleClickTreeEditor}
                    isWarningTextOn={isTreeEditorWarningTextOn}
                    warningText={treeEditorWarningText}
                />
            }
            case 1: {
                return <GeneralFunctions
                        functions={functions}
                        handleUpdateGeneralFunction={handleUpdateGeneralFunction}
                        handleConfirmFunction={handleConfirmFunction}
                        handleClickDeleteFunction={handleClickDeleteFunction}
                        functionsIndex={functionsIndex}
                        setFunctionsIndex={setFunctionsIndex}
                        isWarningTextOn={isGeneralFunctionWarningTextOn}
                        warningText={generalFunctionWarningText}
                        handleRemoveElementGeneralFunction={handleRemoveElementGeneralFunction}
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
            {
                !treeEditor && 
                <button
                className={ styles.confirm }
                style={{ maxWidth: '11rem', minHeight: '2rem', marginTop: '1rem' }}
                onClick={() => handleValidateCharacter(mentalStates, combos, trees, functions)}
                >
                    Validate your character
                </button>
            }
        </Box>
    )
}

export default SidePanel;