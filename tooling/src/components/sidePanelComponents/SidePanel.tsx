import React from 'react';
import { Box } from '@mui/material';
import Tabs, { EditorTabName } from './Tabs';
import MentalStates from './MentalStates';
import TreeEditor from './TreeEditor';
import GeneralFunctions from './GeneralFunctions';
import Combos from './Combos';


const SidePanel = ({
    workingTab, handleClickTab, mentalStates, setMentalStates, initialMentalState, handleSetInitialMentalState, combos, setCombos, handleValidateCombo,
    character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, handleSetMentalStateAction, treeEditor, handleClickTreeEditor,
    trees, setTrees, handleUpdateTree, functions, setFunctions, handleUpdateGeneralFunction, handleConfirmFunction, handleClickDeleteFunction,
    functionsIndex, setFunctionsIndex, isGeneralFunctionWarningTextOn, generalFunctionWarningText, isTreeEditorWarningTextOn, treeEditorWarningText,
    handleRemoveElementGeneralFunction, runCairoSimulationWarning, adversary, setAdversary, onComboChange, fighterSelection, setFighterSelection, setOpponent,
    agents
}) => {
    const content = (workingTab: EditorTabName) => {
        switch (workingTab) {
            case EditorTabName.Mind: {
                return !treeEditor && (
                    <MentalStates
                        mentalStates={mentalStates}
                        initialMentalState={initialMentalState}
                        handleSetInitialMentalState={handleSetInitialMentalState}
                        combos={combos}
                        character={character}
                        setCharacter={setCharacter}
                        handleAddMentalState={handleAddMentalState}
                        handleClickRemoveMentalState={handleClickRemoveMentalState}
                        handleSetMentalStateAction={handleSetMentalStateAction}
                        handleClickTreeEditor={handleClickTreeEditor}
                    />
                ) || !!treeEditor && (
                    <TreeEditor
                        indexTree={ treeEditor - 1 }
                        tree={trees[treeEditor - 1]}
                        handleUpdateTree={handleUpdateTree}
                        mentalStates={mentalStates}
                        functions={functions}
                        handleClickTreeEditor={handleClickTreeEditor}
                        isWarningTextOn={isTreeEditorWarningTextOn}
                        warningText={treeEditorWarningText}
                    />
                )
            }
            case EditorTabName.Combos: {
                return (
                    <Combos
                        character={character}
                        combos={combos}
                        handleValidateCombo={handleValidateCombo}
                    ></Combos>
                )
            }
            case EditorTabName.Conditions: {
                return (
                    <GeneralFunctions
                        functions={functions}
                        handleUpdateGeneralFunction={handleUpdateGeneralFunction}
                        handleConfirmFunction={handleConfirmFunction}
                        handleClickDeleteFunction={handleClickDeleteFunction}
                        functionsIndex={functionsIndex}
                        setFunctionsIndex={setFunctionsIndex}
                        isWarningTextOn={isGeneralFunctionWarningTextOn}
                        warningText={generalFunctionWarningText}
                        handleRemoveElementGeneralFunction={handleRemoveElementGeneralFunction}
                    />
                )
            }
        }
    }
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'left',
                padding: 2,
            }}
        >
            <Tabs workingTab={workingTab} handleClickTab={handleClickTab}></Tabs>
            {content(workingTab)}
        </Box>
    )
}

export default SidePanel;