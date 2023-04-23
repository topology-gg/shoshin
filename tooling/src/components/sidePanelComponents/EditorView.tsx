import React, { useState } from 'react';
import { Box, Button, Link } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import BuildIcon from '@mui/icons-material/Build';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PublishIcon from '@mui/icons-material/Publish';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Tabs, { EditorTabName } from './EditorTabs';
import MentalStates from './MentalStates';
import TreeEditor from './TreeEditor';
import Conditions from './Conditions';
import Combos from './Combos';
import Profile from './Profile';
import ButtonOptionList from './ButtonOptionList';
import Agent from '../../types/Agent';
import { MentalState } from '../../types/MentalState';
import { Character, EditorMode } from '../../constants/constants';
import { Tree } from '../../types/Tree';
import { Condition, ConditionElement } from '../../types/Condition';
import { CircularProgress, Tooltip } from '@mui/material';

interface EditorViewProps {
    editorMode: EditorMode
    settingModalOpen: boolean
    setSettingModalOpen: (bool: boolean) => void
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
    handleUpdateCondition: (index: number, element: ConditionElement, name: string) => void
    handleConfirmCondition: () => void
    handleClickDeleteCondition: (index: number) => void
    conditionUnderEditIndex: number
    setConditionUnderEditIndex: (index: number) => void
    isConditionWarningTextOn: boolean
    conditionWarningText: string
    isTreeEditorWarningTextOn: boolean
    treeEditorWarningText: string
    handleRemoveConditionElement: (index: number) => void
    handleSubmitAgent: () => void
    agents: Agent[]
    handleSaveCondition: (index: number, conditionElements: ConditionElement[]) => void
    txHash?: string
    txPending?: boolean
    txStatusText?: string
}


const EditorView = ({
    editorMode,
    settingModalOpen, setSettingModalOpen,
    studyAgent,
    buildNewAgentFromBlank,
    buildNewAgentFromAgent,
    agentName,setAgentName,
    workingTab, handleClickTab, mentalStates, initialMentalState, handleSetInitialMentalState, combos, handleValidateCombo,
    character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, handleSetMentalStateAction, treeEditor, handleClickTreeEditor,
    trees, handleUpdateTree, conditions, handleUpdateCondition, handleConfirmCondition, handleClickDeleteCondition,
    conditionUnderEditIndex, setConditionUnderEditIndex, isConditionWarningTextOn, conditionWarningText, isTreeEditorWarningTextOn, treeEditorWarningText,
    handleRemoveConditionElement, handleSubmitAgent, agents, handleSaveCondition, txHash, txStatusText, txPending = false,
}: EditorViewProps) => {

    const isReadOnly = editorMode == EditorMode.ReadOnly
    const [openContractInformation, setOpenContractInformation] = React.useState(false);

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
                        handleSaveCondition={handleSaveCondition}
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
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width:'800px',
                    mb: '1rem',
                }}
            >

                {/* for vertically align icon: https://stackoverflow.com/questions/43360526/align-material-icon-vertically */}
                <div style={{marginBottom:'1rem', display:'flex', flexDirection:'row', justifyContent: 'space-between'}}>
                    <p style={{fontSize:'1rem', lineHeight:'1rem'}}>
                        Editor status: {editorMode == EditorMode.ReadOnly ? (
                            <><AutoStoriesIcon sx={{marginLeft: '0.2rem', marginRight:'0.6rem', verticalAlign:'middle'}} />Read Only</>
                        ) : (
                            <><BuildIcon sx={{marginLeft: '0.2rem', marginRight:'0.6rem', verticalAlign:'middle'}} />Edit Agent</>
                        )}
                    </p>
                </div>

                <div style={{display:'flex', flexDirection:'row', gap:'10px'}}>
                    <div >
                        <ButtonOptionList
                            buttonLabel={<><PersonSearchIcon sx={{}} /></>}
                            options={agents}
                            optionLabel={'agent'}
                            optionSelected={(option: Agent) => {
                                console.log('View available agent:', option)
                                studyAgent(option)
                            }}
                        />
                    </div>

                    <div style={{marginBottom: '1rem'}}>
                        <Button
                            id='button-option-list-button'
                            onClick={() => {
                                console.log('Build new Agent from blank');
                                buildNewAgentFromBlank()
                            }}
                            variant="outlined"
                        >
                            <PersonAddAltIcon sx={{}} />
                        </Button>
                    </div>

                    <div style={{marginBottom: '1rem'}}>
                        <ButtonOptionList
                            buttonLabel={<><PersonAddAlt1Icon  sx={{}} /></>}
                            options={agents}
                            optionLabel={'agent'}
                            optionSelected={(option: Agent) => {
                                console.log('Build new Agent from an existing Agent:', option)
                                buildNewAgentFromAgent(option)
                            }}
                        />
                    </div>

                    <div style={{marginBottom: '1rem'}}>
                        <Button
                            id='button-option-list-button'
                            onClick={() => {
                                console.log('Submit Agent onchain');
                                handleSubmitAgent();
                            }}
                            variant="outlined"
                            disabled={editorMode==EditorMode.ReadOnly || txPending}
                        >
                            {txPending ? 
                                <CircularProgress size="20px" color="inherit"/> : 
                                <PublishIcon sx={{}} />
                            }
                        </Button>
                    </div>
                </div>
                <div style={{height:'1rem'}}>
                    {txHash && 
                        <Tooltip title="View on Starkscan" arrow>

                            <Link
                                display="flex"
                                alignItems="center"
                                fontSize="0.8rem"
                                gap="0.25rem"
                                target="_blank"
                                href={`https://testnet.starkscan.co/tx/${txHash}`}
                            >
                                <p>{txStatusText}</p>
                                <OpenInNewIcon fontSize="inherit" />
                            </Link>
                        </Tooltip>
                    }
                </div>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'left',
                    width: '800px',
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
                        height: '500px',
                        overflow: 'scroll',
                    }}
                >
                    {content(workingTab)}
                </Box>

            </Box>

        </Box>
    )
}

export default EditorView;
