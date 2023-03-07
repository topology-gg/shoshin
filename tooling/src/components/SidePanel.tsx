import React from 'react';
import { Box } from '@mui/material';
import Tabs from './Tabs';
import MentalStates from './MentalStates';
import TreeEditor from './TreeEditor';
import GeneralFunctions from './GeneralFunctions';
import Combos from './Combos';
import { AdversarySelection } from './AdversarySelection';
import { FighterSelection } from './FighterSelection';


const SidePanel = ({
    workingTab, handleClickTab, mentalStates, setMentalStates, initialMentalState, handleSetInitialMentalState, combos, setCombos, handleValidateCombo, 
    character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, handleSetMentalStateAction, treeEditor, handleClickTreeEditor, 
    trees, setTrees, handleUpdateTree, functions, setFunctions, handleUpdateGeneralFunction, handleConfirmFunction, handleClickDeleteFunction, 
    functionsIndex, setFunctionsIndex, isGeneralFunctionWarningTextOn, generalFunctionWarningText, isTreeEditorWarningTextOn, treeEditorWarningText, 
    handleRemoveElementGeneralFunction, runCairoSimulationWarning, adversary, setAdversary, onComboChange, fighterSelection, setFighterSelection, setOpponent, 
    agents
}) => {
    const content = (workingTab: number) => {
        switch (workingTab) {
            case 0: {
                return !treeEditor && <MentalStates
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
                return <Combos
                        character={character}
                        combos={combos}
                        handleValidateCombo={handleValidateCombo}
                        ></Combos>
            }
            case 2: {
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
            case 3: {
                return <AdversarySelection
                    warning={runCairoSimulationWarning}
                    adversary={adversary}
                    setAdversary={setAdversary}
                    setOpponent={setOpponent}
                    onComboChange={onComboChange}
                />;
            }
            case 4: {
                return <FighterSelection
                    fighterSelection={fighterSelection}
                    setFighterSelection={setFighterSelection}
                    setOpponent={setOpponent}
                    agents={agents}
                    setMentalStates={setMentalStates}
                    setCombos={setCombos}
                    setTrees={setTrees}
                    functions={functions}
                    setFunctions={setFunctions}
                    setCharacter={setCharacter}
                />;
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