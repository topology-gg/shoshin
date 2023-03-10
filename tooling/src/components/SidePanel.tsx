import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Tabs, { EditorTabName } from './Tabs';
import MentalStates from './MentalStates';
import TreeEditor from './TreeEditor';
import Conditions from './Conditions';
import Combos from './Combos';
import Profile from './Profile';
import ButtonOptionList from './ButtonOptionList';
import Agent from '../types/Agent';
import { MentalState } from '../types/MentalState';
import { Character } from '../constants/constants';
import { Tree } from '../types/Tree';
import { Condition, ConditionElement } from '../types/Condition';

interface SidePanelProps {
    isReadOnly: boolean
    studyAgent: (agent: Agent) => void
    buildNewAgentFromBlank: () => void
    buildNewAgentFromAgent: (agent: Agent) => void
    agentName: string
    setAgentName: (name: string) => void
    workingTab: EditorTabName
    handleClickTab: (tab: EditorTabName) => void
    mentalStates: MentalState[]
    initialMentalState: number
    handleSetInitialMentalState: (initialMentalState: number) => void
    combos: number[][]
    handleValidateCombo: (combo: number[], index: number) => void
    character: Character
    setCharacter: (character: Character) => void
    handleAddMentalState: (new_state: string) => void
    handleClickRemoveMentalState: (index: number) => void
    handleSetMentalStateAction: (index: number, action: number) => void
    treeEditor: number
    handleClickTreeEditor: (index: number) => void
    trees: Tree[]
    handleUpdateTree: (index: number, input: string) => void
    conditions: Condition[]
    handleUpdateCondition: (index: number, element: ConditionElement) => void
    handleConfirmCondition: () => void
    handleClickDeleteCondition: (index: number) => void
    conditionUnderEditIndex: number 
    setConditionUnderEditIndex: (index: number) => void
    isConditionWarningTextOn: boolean
    conditionWarningText: string 
    isTreeEditorWarningTextOn: boolean
    treeEditorWarningText: string
    handleRemoveConditionElement: (index: number) => void
    agents: Agent[]
}


const SidePanel = ({
    isReadOnly,
    studyAgent,
    buildNewAgentFromBlank,
    buildNewAgentFromAgent,
    agentName,setAgentName,
    workingTab, handleClickTab, mentalStates, initialMentalState, handleSetInitialMentalState, combos, handleValidateCombo, 
    character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, handleSetMentalStateAction, treeEditor, handleClickTreeEditor, 
    trees, handleUpdateTree, conditions, handleUpdateCondition, handleConfirmCondition, handleClickDeleteCondition, 
    conditionUnderEditIndex, setConditionUnderEditIndex, isConditionWarningTextOn, conditionWarningText, isTreeEditorWarningTextOn, treeEditorWarningText, 
    handleRemoveConditionElement, agents
}: SidePanelProps) => {
    const content = (workingTab: EditorTabName) => {
        switch (workingTab) {
            case EditorTabName.Profile: {
                return (
                    <Profile
                        isReadOnly={isReadOnly}
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
                        isReadOnly={isReadOnly}
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
                        isReadOnly={isReadOnly}
                        indexTree={ treeEditor - 1 }
                        tree={trees[treeEditor - 1]}
                        handleUpdateTree={handleUpdateTree}
                        mentalStates={mentalStates}
                        conditions={conditions}
                        handleClickTreeEditor={handleClickTreeEditor}
                        isWarningTextOn={isTreeEditorWarningTextOn}
                        warningText={treeEditorWarningText}
                    />
                )
            }

            case EditorTabName.Combos: {
                return (
                    <Combos
                        isReadOnly={isReadOnly}
                        character={character}
                        combos={combos}
                        handleValidateCombo={handleValidateCombo}
                    ></Combos>
                )
            }
            case EditorTabName.Conditions: {
                return <Conditions
                        isReadOnly={isReadOnly}
                        conditions={conditions}
                        handleUpdateCondition={handleUpdateCondition}
                        handleConfirmCondition={handleConfirmCondition}
                        handleClickDeleteCondition={handleClickDeleteCondition}
                        conditionUnderEditIndex={conditionUnderEditIndex}
                        setConditionUnderEditIndex={setConditionUnderEditIndex}
                        isWarningTextOn={isConditionWarningTextOn}
                        warningText={conditionWarningText}
                        handleRemoveConditionElement={handleRemoveConditionElement}
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
                        buttonLabel={<><AutoStoriesIcon sx={{marginRight:'0.6rem'}} />Study available Agent (read-only)</>}
                        options={agents}
                        optionLabel={'agent'}
                        optionSelected={(option: Agent) => {
                            console.log('View available agent:', option)
                            studyAgent(option)
                        }}
                    />
                </div>

                <div style={{marginBottom:'1rem'}}>
                    <Button
                        id='button-option-list-button'
                        onClick={() => {
                            console.log('Build new Agent from blank');
                            buildNewAgentFromBlank()
                        }}
                        variant="outlined"
                    >
                        <BuildIcon sx={{marginRight:'0.6rem'}} /> Build new Agent from blank
                    </Button>
                </div>

                <div style={{marginBottom:'1rem'}}>
                    <ButtonOptionList
                        buttonLabel={<><BuildIcon  sx={{marginRight:'0.6rem'}} />Build new Agent from an existing Agent</>}
                        options={agents}
                        optionLabel={'agent'}
                        optionSelected={(option: Agent) => {
                            console.log('Build new Agent from an existing Agent:', option)
                            buildNewAgentFromAgent(option)
                        }}
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