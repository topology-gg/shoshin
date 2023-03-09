import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Tabs, { EditorTabName } from './Tabs';
import MentalStates from './MentalStates';
import TreeEditor from './TreeEditor';
import GeneralFunctions from './GeneralFunctions';
import Combos from './Combos';
import Profile from './Profile';
import ButtonOptionList from './ButtonOptionList';


const SidePanel = ({
    agentName,setAgentName,
    workingTab, handleClickTab,
    mentalStates, setMentalStates, initialMentalState, handleSetInitialMentalState, combos, setCombos, handleValidateCombo,
    character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, handleSetMentalStateAction, treeEditor, handleClickTreeEditor,
    trees, setTrees, handleUpdateTree, functions, setFunctions, handleUpdateGeneralFunction, handleConfirmFunction, handleClickDeleteFunction,
    functionsIndex, setFunctionsIndex, isGeneralFunctionWarningTextOn, generalFunctionWarningText, isTreeEditorWarningTextOn, treeEditorWarningText,
    handleRemoveElementGeneralFunction, runCairoSimulationWarning, onComboChange, fighterSelection, setFighterSelection, agents
}) => {
    const content = (workingTab: EditorTabName) => {
        switch (workingTab) {
            case EditorTabName.Profile: {
                return (
                    <Profile
                        agentName={agentName}
                        setAgentName={setAgentName}
                        character={character}
                        setCharacter={setCharacter}
                    />
                )
            }
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'left',
                    mb: '1rem'
                }}
            >

                <div style={{marginBottom:'1rem'}}>
                    <p>TODO: Implement status bar e.g. "Editing new Agent" or "Viewing agent __agent name__"</p>
                </div>

                <div style={{marginBottom:'1rem'}}>
                    <ButtonOptionList
                        buttonLabel='View available Agent (read-only)'
                        options={agents}
                        optionLabel={'agent'}
                        optionSelected={(option) => {console.log('View available agent:', option)}}
                    />
                </div>

                <div style={{marginBottom:'1rem'}}>
                    <Button
                        id='button-option-list-button'
                        onClick={() => {console.log('Create new Agent from blank')}}
                        variant="outlined"
                    >
                        Create new Agent from blank
                    </Button>
                </div>

                <div style={{marginBottom:'1rem'}}>
                    <ButtonOptionList
                        buttonLabel='Create new Agent from available Agent'
                        options={agents}
                        optionLabel={'agent'}
                        optionSelected={(option) => {console.log('Create new Agent from available Agent:', option)}}
                    />
                </div>

            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'left',
                }}
            >
                <Tabs workingTab={workingTab} handleClickTab={handleClickTab}></Tabs>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'top',
                        alignItems: 'left',
                        borderRadius: '0px 20px 20px 20px',
                        border: '1px solid #999999',
                        padding: '0.5rem 0.5rem 2rem 0.5rem',
                        height: '30rem',
                        overflow: 'auto',
                    }}
                >
                    {content(workingTab)}
                </Box>

            </Box>

        </Box>
    )
}

export default SidePanel;