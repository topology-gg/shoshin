import React from 'react';
import { Box } from '@mui/material';
import Tabs from './Tabs';
import MentalStates from './MentalStates';
import TreeEditor from './TreeEditor';
import Conditions from './Conditions';
import Combos from './Combos';
import { MentalState } from '../types/MentalState';
import { Character } from '../constants/constants';
import { Tree } from '../types/Tree';
import { Condition, ConditionElement } from '../types/Condition';

interface SidePanelProps {
    workingTab: number
    handleClickTab: (tab: number) => void
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
    handleRemoveElement: (index: number) => void
}


const SidePanel = ({
    workingTab, handleClickTab, mentalStates, initialMentalState, handleSetInitialMentalState, combos, handleValidateCombo, 
    character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, handleSetMentalStateAction, treeEditor, handleClickTreeEditor, 
    trees, handleUpdateTree, conditions, handleUpdateCondition, handleConfirmCondition, handleClickDeleteCondition, 
    conditionUnderEditIndex, setConditionUnderEditIndex, isConditionWarningTextOn, conditionWarningText, isTreeEditorWarningTextOn, treeEditorWarningText, 
    handleRemoveElement
}: SidePanelProps) => {
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
                    conditions={conditions}
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
                return <Conditions
                        conditions={conditions}
                        handleUpdateCondition={handleUpdateCondition}
                        handleConfirmCondition={handleConfirmCondition}
                        handleClickDeleteCondition={handleClickDeleteCondition}
                        conditionUnderEditIndex={conditionUnderEditIndex}
                        setConditionUnderEditIndex={setConditionUnderEditIndex}
                        isWarningTextOn={isConditionWarningTextOn}
                        warningText={conditionWarningText}
                        handleRemoveElement={handleRemoveElement}
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