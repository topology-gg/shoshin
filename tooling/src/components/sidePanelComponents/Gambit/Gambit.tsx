import React, { memo, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Grid,
    MenuItem,
    Switch,
    Tooltip,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { ACTION_UNICODE_MAP, Character } from '../../../constants/constants';
import BlurrableButton from '../../ui/BlurrableButton';
import {
    Layer,
    defaultLayer,
    alwaysTrueCondition,
    LayerCondition,
} from '../../../types/Layer';
import { Condition } from '../../../types/Condition';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BlurrableListItemText from '../../ui/BlurrableListItemText';
import { Action, CHARACTERS_ACTIONS, Rest } from '../../../types/Action';
import styles from './Gambit.module.css';
import ComboEditor from '../ComboEditor';
import CloseIcon from '@mui/icons-material/Close';
import { FileCopy, MoreHoriz, VerticalAlignCenter } from '@mui/icons-material';
import SingleCondition from './Condition';
import { truncate } from 'fs';
import ConditionsMenu from './ConditionsMenu';

//We have nested map calls in our render so we cannot access layer index from action/condition click
// I think we can just parse this index from id={....}
let currentMenu = 0;
let currentConditionMenu = 0;

let gridOrderPortion = 1.2;
let gridConditionPortionXl = 4.4;
let gridConditionPortionMd = 4.4;
let gridActionPortion = 4.4;
let suiCheckboxPortion = 1;
let randCheckboxPortion = 1;
let checkboxPortion = 1.2;
let gridRemovePortion = 0.8;

const suiFontColor = '#003892';
const rndFontColor = '#920000';

const actionIndexToAction = (
    action: number,
    characterIndex: number
): Action => {
    if (action < 100) {
        // find the Action whose id matches action the number
        return CHARACTERS_ACTIONS[characterIndex].find((e) => e.id == action);
    } else {
        return {
            id: -1,
            display: {
                name: `Combo ${action - 101}`,
                unicode: '\u{1F4BE}',
            },
            frames: {
                duration: 1,
            },
            key: '-',
            bodyState: 0,
        };
    }
};

export interface GambitFeatures {
    layerAddAndDelete: boolean;
    conditionAnd: boolean;
    combos: boolean;
    sui: boolean;
    actionRandomness?: boolean;
}
export const FullGambitFeatures: GambitFeatures = {
    layerAddAndDelete: true,
    conditionAnd: true,
    combos: true,
    sui: true,
    actionRandomness: true,
};

interface GambitProps {
    isAnimationRunning: boolean;
    layers: Layer[];
    setLayers: (layers: Layer[]) => void;
    character: Character;
    conditions: Condition[];
    actions: Action[];
    combos: Action[][];
    setCombos: (combo: Action[][]) => void;
    activeMs: number;
    features: GambitFeatures;
    initialSelectedCombo?: number;
    onResetClick?: () => void;
}

export interface LayerProps {
    layer: Layer;
    index: number;
    isReadOnly: boolean;
    character: Character;
    conditions: Condition[];
    actions: Action[];
    combos: Action[][];
    handleRemoveLayer: (index: number) => void;
    handleDuplicateLayer: (index: number) => void;
    //Check if previously combo and close
    handleChooseAction: (actionName: string, layerIndex: number) => void;
    handleChooseAlternativeAction: (
        actionName: string,
        layerIndex: number
    ) => void;
    // -1 index is a new condition
    handleChooseCondition: (condition: Condition, index: number) => void;
    handleRemoveCondition: (layerIndex: number, conditionIndex: number) => void;
    handleInvertCondition: (layerIndex: number, conditionIndex: number) => void;
    //Layer either can make combo or edit the combo
    handleChooseCombo: (layerIndex: number) => void;
    handleChangeCondition: (
        condition: Condition,
        conditionIndex: number,
        layerIndex: number
    ) => void;
    isActive: boolean;
    features: GambitFeatures;
    toggleIsLayerSui: (layerIndex: number) => void;
    setLayerProbability: (layerIndex: number, probability: number) => void;
    isAnimationRunning: boolean;
}

//Select +Combo,

//probably can use spread operator for props
const DraggableLayer = ({
    layer,
    index,
    isReadOnly,
    character,
    conditions,
    actions,
    combos,
    handleChooseAction,
    handleChooseAlternativeAction,
    handleChooseCondition,
    handleRemoveCondition,
    handleRemoveLayer,
    handleDuplicateLayer,
    handleInvertCondition,
    handleChooseCombo,
    handleChangeCondition,
    isActive,
    features,
    toggleIsLayerSui,
    setLayerProbability,
    isAnimationRunning,
}: LayerProps) => {
    const handleChangeLayerCondition = (
        condition: Condition,
        conditionIndex: number
    ) => handleChangeCondition(condition, conditionIndex, index);

    return (
        <Draggable
            draggableId={index.toString()}
            index={index}
            isDragDisabled={isAnimationRunning}
        >
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                        ...provided.draggableProps.style,
                        position: 'static',
                    }}
                    {...provided.dragHandleProps}
                >
                    <LayerComponent
                        layer={layer}
                        index={index}
                        isReadOnly={isReadOnly}
                        character={character}
                        conditions={conditions}
                        combos={combos}
                        handleChooseAction={handleChooseAction}
                        handleChooseAlternativeAction={
                            handleChooseAlternativeAction
                        }
                        handleChooseCondition={handleChooseCondition}
                        handleRemoveLayer={handleRemoveLayer}
                        handleDuplicateLayer={handleDuplicateLayer}
                        handleRemoveCondition={handleRemoveCondition}
                        handleInvertCondition={handleInvertCondition}
                        handleChooseCombo={handleChooseCombo}
                        handleChangeCondition={handleChangeLayerCondition}
                        isActive={isActive}
                        features={features}
                        actions={actions}
                        toggleIsLayerSui={toggleIsLayerSui}
                        setLayerProbability={setLayerProbability}
                        isAnimationRunning={isAnimationRunning}
                    />
                </div>
            )}
        </Draggable>
    );
};

export const LayerComponent = ({
    layer,
    index: i,
    isReadOnly,
    character,
    conditions,
    combos,
    handleChooseAction,
    handleChooseAlternativeAction,
    handleChooseCondition,
    handleRemoveCondition,
    handleRemoveLayer,
    handleDuplicateLayer,
    handleInvertCondition,
    handleChooseCombo,
    handleChangeCondition,
    isActive,
    features,
    actions,
    toggleIsLayerSui,
    setLayerProbability,
    isAnimationRunning,
}: LayerProps) => {
    const [actionAnchorEl, setActionAnchorEl] = useState<null | HTMLElement>(
        null
    );

    const [alternativeActionAnchorEl, setAlternativeActionAnchorEl] =
        useState<null | HTMLElement>(null);

    const [actionProbAnchorEl, setActionProbAnchorEl] =
        useState<null | HTMLElement>(null);

    const [alternativeActionProbAnchorEl, setAlternativeActionProbAnchorEl] =
        useState<null | HTMLElement>(null);

    const [conditionAnchorEl, setConditionAnchorEl] =
        useState<null | HTMLElement>(null);

    const [conditionIndex, changeConditionIndex] = useState<number>(-1);

    const [layerOptionsMenuOpen, setLayerOptionsMenuOpen] = useState(false);

    const moreOptionsButtonRef = useRef();

    let characterIndex = Object.keys(Character).indexOf(character);

    const actionOpen = Boolean(actionAnchorEl);
    const altActionOpen = Boolean(alternativeActionAnchorEl);
    const actionProbOpen = Boolean(actionProbAnchorEl);
    const altActionProbOpen = Boolean(alternativeActionProbAnchorEl);
    const conditionsOpen = Boolean(conditionAnchorEl);

    let actionsDisplayNames = actions.map((a) => a.display.name);

    if (features.combos) {
        actionsDisplayNames.push(`Combo`);
    }

    const onActionSelect = (action: string) => {
        if (!action.includes('Combo')) {
            handleChooseAction(action, i);
        } else {
            handleChooseCombo(i);
        }

        setActionAnchorEl(null);
    };

    const onAltActionSelect = (action: string) => {
        //
        // TODO: support using combo as alternative action
        //
        handleChooseAlternativeAction(action, i);
        setAlternativeActionAnchorEl(null);
    };

    const onActionProbSelect = (prob: number, isAlt: boolean) => {
        const probNormalized = prob / 10;
        console.log('probNormalized', probNormalized);
        if (!isAlt) {
            setLayerProbability(i, probNormalized);
            setActionProbAnchorEl(null);
        } else {
            setLayerProbability(i, 10 - probNormalized);
            setAlternativeActionProbAnchorEl(null);
        }
    };

    const onConditionSelect = (condition: Condition) => {
        handleChooseCondition(condition, conditionIndex);
        setActionAnchorEl(null);
        setConditionAnchorEl(null);
    };

    const handleActionClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        isAlt: boolean
    ) => {
        let id = event.currentTarget.id.split('-');
        let menuIndex = parseInt(id[id.length - 1]);
        if (!isAlt) {
            currentMenu = menuIndex;
            setActionAnchorEl(event.currentTarget);
        } else {
            setAlternativeActionAnchorEl(event.currentTarget);
        }
    };

    const handleActionProbClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        isAlt: boolean
    ) => {
        let id = event.currentTarget.id.split('-');
        let menuIndex = parseInt(id[id.length - 1]);
        if (!isAlt) {
            currentMenu = menuIndex;
            setActionProbAnchorEl(event.currentTarget);
        } else {
            setAlternativeActionProbAnchorEl(event.currentTarget);
        }
    };

    const handleConditionClick = (
        event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
    ) => {
        const targetId = event.currentTarget.id;
        let id = targetId.split('-');

        let menuIndex = parseInt(id[id.length - 2]);
        currentConditionMenu = menuIndex;

        let secondItem = id[id.length - 1];
        if (secondItem == `new`) {
            changeConditionIndex(-1);
        } else {
            let conditionIndex = parseInt(secondItem);
            changeConditionIndex(conditionIndex);
        }

        setConditionAnchorEl(event.currentTarget);
    };

    const handleCloseActionDropdown = (isAlt: boolean) => {
        if (!isAlt) {
            setActionAnchorEl(null);
        } else {
            setAlternativeActionAnchorEl(null);
        }
    };

    const handleCloseActionProbDropdown = (isAlt: boolean) => {
        if (!isAlt) {
            setActionProbAnchorEl(null);
        } else {
            setAlternativeActionProbAnchorEl(null);
        }
    };

    const handleCloseConditionDropdown = () => {
        setConditionAnchorEl(null);
    };

    const handleConditionValueChange = (condition, index) => {
        handleChangeCondition(condition, index, i);
    };

    const action: Action = actionIndexToAction(layer.action.id, characterIndex);
    const altAction: Action = !layer.actionAlternative
        ? actionIndexToAction(Rest.id, characterIndex)
        : actionIndexToAction(layer.actionAlternative.id, characterIndex);

    const randomnessEnabled =
        typeof layer.probability === 'number' && layer.probability != 0;

    const actionButton = (
        <div style={{ height: '2rem' }}>
            {features.actionRandomness && randomnessEnabled && (
                <button
                    className={`${styles.gambitLeftHalfButton} ${styles.probabilityButton}`}
                    onClick={(evt) => handleActionProbClick(evt, false)}
                    disabled={isReadOnly}
                >
                    {`${layer.probability * 10}%`}
                </button>
            )}

            <BlurrableButton
                className={`${
                    features.actionRandomness && randomnessEnabled
                        ? styles.gambitRightHalfButton
                        : styles.gambitButton
                } ${styles.actionButton}`}
                key={`action-button-${i}`}
                id={`condition-btn-${i}`}
                onClick={(evt) => handleActionClick(evt, false)}
                disabled={action.id == -1 ? false : isReadOnly}
            >
                {/* <span style={{ marginRight: '7px' }}>
                    {action.display.unicode}
                </span>{' '} */}
                {action.display.name}
            </BlurrableButton>
        </div>
    );

    const actionAlternativeButton = (
        <div style={{ height: '2rem', marginTop: '6px' }}>
            <button
                className={`${styles.gambitLeftHalfButton} ${styles.probabilityButton}`}
                onClick={(evt) => handleActionProbClick(evt, true)}
                disabled={isReadOnly}
            >
                {`${(10 - layer.probability) * 10}%`}
            </button>
            <BlurrableButton
                className={`${
                    features.actionRandomness && randomnessEnabled
                        ? styles.gambitRightHalfButton
                        : styles.gambitButton
                } ${styles.actionButton}`}
                key={`alt-action-button-${i}`}
                id={`condition-btn-${i}`}
                onClick={(evt) => handleActionClick(evt, true)}
                disabled={isReadOnly}
            >
                {/* <span style={{ marginRight: '7px' }}>
                    {altAction.display.unicode}
                </span>{' '} */}
                {altAction.display.name}
            </BlurrableButton>
        </div>
    );

    const switchSx = (text: string, activeColor: string) => {
        return {
            width: '50px',
            height: '45px',
            '& .MuiSwitch-switchBase': {
                '&.Mui-checked': {
                    '& .MuiSwitch-thumb': {
                        backgroundColor: activeColor,
                    },
                },
            },
            '& .MuiSwitch-thumb': {
                backgroundColor: '#CCCCCC',
                width: '28px',
                height: '28px',
                textAlign: 'center',
                '&:before': {
                    content: "'" + `${text}` + "'",
                    width: '100%',
                    height: '100%',
                    lineHeight: '28px',
                    fontSize: '11px',
                    color: 'white',
                },
            },
            '& .MuiSwitch-track': {
                height: '21px',
                borderRadius: '14px',
            },
        };
    };

    return (
        <Box
            key={`button-wrapper-${i}`}
            sx={{
                width: '100%',
                border: `1px solid ${isActive ? '#000' : '#ccc'}`,
                background: isActive ? '#ffffffCC' : '00000000',
                marginBottom: '4px',
                borderRadius: '20px',
                padding: '8px 0 8px 0',
            }}
        >
            <Grid container alignItems={'center'} spacing={1}>
                <Grid item xs={gridOrderPortion}>
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '13px',
                        }}
                    >
                        <Typography
                            sx={{
                                color: `${isActive ? '#000' : '#000'}`,
                                fontFamily: 'Eurostile',
                            }}
                        >
                            {i + 1}
                        </Typography>
                    </div>
                </Grid>
                <Grid
                    item
                    md={gridConditionPortionMd}
                    xl={gridConditionPortionXl}
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        flexWrap={'wrap'}
                        style={{ verticalAlign: 'bottom' }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                            }}
                        >
                            {layer.conditions.map((condition, index) => (
                                <SingleCondition
                                    key={`${i}-${index}`}
                                    condition={condition}
                                    conditionIndex={index}
                                    layerIndex={i}
                                    onClick={handleConditionClick}
                                    onRemove={
                                        layer.conditions.length > 1 &&
                                        handleRemoveCondition
                                    }
                                    onInvertCondition={handleInvertCondition}
                                    onValueChange={handleConditionValueChange}
                                    isReadOnly={isReadOnly}
                                />
                            ))}
                        </div>

                        <div>
                            {features.conditionAnd &&
                            layer.conditions.length >= 1 &&
                            !(
                                JSON.stringify(layer.conditions[0]) ===
                                JSON.stringify(alwaysTrueCondition)
                            ) ? (
                                <IconButton
                                    onClick={handleConditionClick}
                                    id={`condition-btn-${i}-new`}
                                    style={{ color: '#000' }}
                                >
                                    <AddIcon
                                        sx={{ width: '0.6em', height: '0.6em' }}
                                    />
                                </IconButton>
                            ) : null}
                        </div>
                    </Box>
                </Grid>

                <ConditionsMenu
                    anchorEl={conditionAnchorEl}
                    open={conditionsOpen}
                    conditions={conditions}
                    onClose={handleCloseConditionDropdown}
                    onSelect={onConditionSelect}
                />

                <Grid item md={gridActionPortion} xl={gridActionPortion}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        flexWrap={'wrap'}
                    >
                        {actionButton}

                        {features.actionRandomness &&
                            randomnessEnabled &&
                            actionAlternativeButton}
                    </Box>
                </Grid>

                {/* Menu for picking the primary action */}
                <Menu
                    id={`actions-menu-${i}`}
                    anchorEl={actionAnchorEl}
                    open={actionOpen}
                    onClose={(evt) => handleCloseActionDropdown(false)}
                    PaperProps={{
                        style: {
                            maxHeight: 220,
                            width: 180,
                            backgroundColor: '#000',
                        },
                    }}
                >
                    {actionsDisplayNames.map((action) => {
                        return (
                            <MenuItem className={'styles.actionMenuItem'}>
                                <BlurrableListItemText
                                    onClick={(e) => onActionSelect(action)}
                                >
                                    <span
                                        style={{
                                            marginRight: '7px',
                                            fontSize: '16px',
                                        }}
                                    >
                                        {ACTION_UNICODE_MAP[action]}
                                    </span>
                                    <span style={{ color: '#fff' }}>
                                        {action.replaceAll('_', ' ')}
                                    </span>
                                </BlurrableListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>

                {/* Menu for picking the alternative action when action randomness is employed*/}
                <Menu
                    id={`alt-actions-menu-${i}`}
                    anchorEl={alternativeActionAnchorEl}
                    open={altActionOpen}
                    onClose={(evt) => handleCloseActionDropdown(true)}
                    PaperProps={{
                        style: {
                            maxHeight: 220,
                            width: 180,
                            backgroundColor: '#000',
                        },
                    }}
                >
                    {actionsDisplayNames.slice(0, -1).map((action) => {
                        return (
                            <MenuItem>
                                <BlurrableListItemText
                                    onClick={(e) => onAltActionSelect(action)}
                                >
                                    <span
                                        style={{
                                            marginRight: '7px',
                                            fontSize: '16px',
                                        }}
                                    >
                                        {ACTION_UNICODE_MAP[action]}
                                    </span>
                                    <span style={{ color: '#fff' }}>
                                        {action.replaceAll('_', ' ')}
                                    </span>
                                </BlurrableListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>

                {/* Menu for picking the probability for the primary action */}
                <Menu
                    id={`actions-probability-menu-${i}`}
                    anchorEl={actionProbAnchorEl}
                    open={actionProbOpen}
                    onClose={(evt) => handleCloseActionProbDropdown(false)}
                    PaperProps={{
                        style: {
                            maxHeight: 220,
                            width: 80,
                            backgroundColor: '#000',
                        },
                    }}
                >
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((prob) => {
                        return (
                            <MenuItem>
                                <BlurrableListItemText
                                    onClick={(e) =>
                                        onActionProbSelect(prob, false)
                                    }
                                >
                                    <span
                                        style={{ color: '#fff' }}
                                    >{`${prob}%`}</span>
                                </BlurrableListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>

                {/* Menu for picking the probability for the alternative action */}
                <Menu
                    id={`alt-actions-probability-menu-${i}`}
                    anchorEl={alternativeActionProbAnchorEl}
                    open={altActionProbOpen}
                    onClose={(evt) => handleCloseActionProbDropdown(true)}
                    PaperProps={{
                        style: {
                            maxHeight: 220,
                            width: 80,
                            backgroundColor: '#000',
                        },
                    }}
                >
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((prob) => {
                        return (
                            <MenuItem>
                                <BlurrableListItemText
                                    onClick={(e) =>
                                        onActionProbSelect(prob, true)
                                    }
                                >
                                    <span
                                        style={{ color: '#fff' }}
                                    >{`${prob}%`}</span>
                                </BlurrableListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>

                <Grid item xs={checkboxPortion}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {features.sui && (
                            <Switch
                                size="small"
                                onChange={() => {
                                    toggleIsLayerSui(i);
                                }}
                                checked={layer.sui}
                                sx={switchSx('SUI', suiFontColor)}
                                disabled={isReadOnly}
                            />
                        )}

                        {features.actionRandomness && (
                            <Switch
                                size="small"
                                onChange={() => {
                                    setLayerProbability(
                                        i,
                                        !layer.probability
                                            ? 5
                                            : layer.probability == 0
                                            ? 5
                                            : 0
                                    );
                                }}
                                checked={randomnessEnabled}
                                sx={switchSx('MIX', rndFontColor)}
                                disabled={isReadOnly}
                            />
                        )}
                    </div>
                </Grid>
                {/*
                {features.sui && (
                    <Grid item xs={suiCheckboxPortion}>
                        <Switch
                            size="small"
                            onChange={() => {
                                toggleIsLayerSui(i);
                            }}
                            checked={layer.sui}
                        />
                    </Grid>
                )}

                {features.actionRandomness && (
                    <Grid item xs={randCheckboxPortion}>
                        <Switch
                            size="small"
                            onChange={() => {
                                setLayerProbability(
                                    i,
                                    !layer.probability
                                        ? 5
                                        : layer.probability == 0
                                        ? 5
                                        : 0
                                );
                            }}
                            checked={layer.probability != 0}
                        />
                    </Grid>
                )} */}

                <Grid item xs={gridRemovePortion}>
                    {features.layerAddAndDelete ? (
                        <IconButton
                            onClick={() => setLayerOptionsMenuOpen(true)}
                            disabled={isReadOnly}
                            style={{ marginLeft: 'auto' }}
                            ref={moreOptionsButtonRef}
                        >
                            <MoreHoriz
                                sx={{ fontSize: '16px', color: '#888' }}
                            />
                        </IconButton>
                    ) : null}
                    <Menu
                        open={layerOptionsMenuOpen}
                        onClose={() => setLayerOptionsMenuOpen(false)}
                        anchorEl={moreOptionsButtonRef.current}
                    >
                        <MenuItem onClick={(_) => handleRemoveLayer(i)}>
                            Delete
                        </MenuItem>
                        <MenuItem onClick={() => handleDuplicateLayer(i)}>
                            Duplicate
                        </MenuItem>
                    </Menu>
                </Grid>
            </Grid>
        </Box>
    );
};

const Gambit = ({
    isAnimationRunning,
    layers,
    setLayers,
    character,
    conditions,
    combos,
    setCombos,
    activeMs,
    features,
    actions,
    initialSelectedCombo,
    onResetClick,
}: GambitProps) => {
    const handleCreateLayer = () => {
        // We need to make a deep copy otherwise this exported object is reassigned
        const deepCopy = JSON.parse(JSON.stringify(defaultLayer));
        // insert layer at lowest priority
        setLayers([...layers, deepCopy]);
    };

    let characterIndex = Object.keys(Character).indexOf(character);

    const [selectedCombo, changeSelectedCombo] = useState<number>(
        initialSelectedCombo >= 0 ? initialSelectedCombo : -1
    );

    useEffect(() => {
        changeSelectedCombo(initialSelectedCombo);
    }, [initialSelectedCombo]);

    const usedLayersByCombo = layers
        .reduce((acc: number[], layer, index) => {
            let updated = acc;
            if (layer.action.id == selectedCombo && layer.action.isCombo) {
                updated.push(index);
            }
            return updated;
        }, [])
        .join(', ');

    function onDragEnd(result) {
        const { draggableId, source, destination } = result;

        if (!destination) {
            return;
        }

        if (destination.index === source.index) {
            return;
        }

        const updatedLayers = Array.from(layers);
        const [removedItem] = updatedLayers.splice(source.index, 1);
        updatedLayers.splice(destination.index, 0, removedItem);

        setLayers(updatedLayers);
    }

    const handleRemoveLayer = (index: number) => {
        let updatedArray = [...layers];
        updatedArray.splice(index, 1);

        setLayers(updatedArray);
    };

    const handleDuplicateLayer = (index: number) => {
        let updatedArray = [...layers];
        let updatedLayer = JSON.parse(JSON.stringify(layers[index]));
        if (layers[index].action.isCombo) {
            let updatedCombos = [...combos];

            updatedCombos.push(
                JSON.parse(
                    JSON.stringify(combos[layers[index].action.id - 101])
                )
            );
            setCombos(updatedCombos);

            let updatedLayer = layers[index];
            updatedLayer.action.id = 101 + combos.length;
        }

        updatedArray.splice(index, 0, updatedLayer);

        setLayers(updatedArray);
    };

    const handleChooseAction = (actionName: string, layerIndex: number) => {
        const layer = layers[layerIndex];

        let updatedLayers: Layer[] = JSON.parse(JSON.stringify(layers));

        //If the current layers going from a combo to an action then remove the combo from combos, decrement ids of other combos
        if (layer.action.isCombo == true) {
            const actionId = layer.action.id;
            combos.splice(layerIndex, 1);
            updatedLayers = updatedLayers.map((layer, index) => {
                const currentActionId = layer.action.id;
                if (
                    actionId < currentActionId &&
                    layer.action.isCombo == true
                ) {
                    return {
                        ...layer,
                        action: {
                            id: layer.action.id - 1,
                            isCombo: true,
                        },
                    };
                }
                return layer;
            });
        }

        updatedLayers[layerIndex] = {
            ...layer,
            action: {
                id:
                    CHARACTERS_ACTIONS[characterIndex].find(
                        (e) => e.display.name == actionName
                    ).id || 0,
                isCombo: false,
            },
        };

        setCombos(combos);
        setLayers(updatedLayers);
    };

    const handleChooseAlternativeAction = (
        actionName: string,
        layerIndex: number
    ) => {
        const layer = layers[layerIndex];

        let updatedLayers: Layer[] = JSON.parse(JSON.stringify(layers));

        updatedLayers[layerIndex] = {
            ...layer,
            actionAlternative: {
                id:
                    CHARACTERS_ACTIONS[characterIndex].find(
                        (e) => e.display.name == actionName
                    ).id || 0,
                isCombo: false,
            },
        };

        setCombos(combos);
        setLayers(updatedLayers);
    };

    const handleSelectCombo = (layerIndex: number) => {
        const layer = layers[layerIndex];

        if (layer.action.isCombo) {
            changeSelectedCombo(layer.action.id - 101);
        } else {
            let updatedLayers: Layer[] = layers.map((layer, index) => {
                if (index == currentMenu) {
                    return {
                        ...layer,
                        action: {
                            id: 101 + combos.length,
                            isCombo: true,
                        },
                    };
                }
                return layer;
            });
            setCombos([...combos, []]);
            setLayers(updatedLayers);
            changeSelectedCombo(combos.length);
        }
    };

    const handleChooseCondition = (condition, conditionIndex) => {
        let updatedLayers = [...layers];

        const conditionDeepCopy = JSON.parse(JSON.stringify(condition));

        if (conditionIndex == -1) {
            updatedLayers[currentConditionMenu].conditions.push(
                conditionDeepCopy
            );
        } else {
            updatedLayers[currentConditionMenu].conditions[conditionIndex] =
                conditionDeepCopy;
        }
        setLayers(updatedLayers);
    };

    const handleRemoveCondition = (
        layerIndex: number,
        conditionIndex: number
    ) => {
        let updatedLayers = layers.map((layer, index) => {
            if (index == layerIndex) {
                let updatedConditions = [...layer.conditions];
                updatedConditions.splice(conditionIndex, 1);
                return {
                    ...layer,
                    conditions: updatedConditions,
                };
            }
            return layer;
        });
        setLayers(updatedLayers);
    };

    const handleInvertCondition = (layerIndex, conditionIndex) => {
        let updatedLayers = [...layers];

        if (
            conditionIndex >= 0 &&
            conditionIndex <= updatedLayers[layerIndex].conditions.length
        ) {
            updatedLayers[layerIndex].conditions[conditionIndex].isInverted =
                !updatedLayers[layerIndex].conditions[conditionIndex]
                    .isInverted;
        }
        setLayers(updatedLayers);
    };

    const handleToggleIsLayerSui = (layerIndex) => {
        let updatedLayers = [...layers];
        updatedLayers[layerIndex].sui = !updatedLayers[layerIndex].sui;
        setLayers(updatedLayers);
    };

    const handleSetLayerProbability = (
        layerIndex: number,
        probability: number
    ) => {
        let updatedLayers = [...layers];

        // TODO: change to setting instead of toggling
        updatedLayers[layerIndex].probability = probability;
        // updatedLayers[layerIndex].probability != 0 ? 0 : probability;
        console.log(
            'handleSetLayerProbability, layerIndex =',
            layerIndex,
            'probability =',
            probability
        );
        setLayers(updatedLayers);
    };

    const handleChangeCondition = (
        condition: LayerCondition,
        conditionIndex: number,
        layerIndex: number
    ) => {
        setLayers(
            layers.map((layer, lIndex) =>
                lIndex === layerIndex
                    ? {
                          ...layer,
                          conditions: layer.conditions.map((c, cIndex) =>
                              cIndex === conditionIndex ? condition : c
                          ),
                      }
                    : layer
            )
        );
    };

    const layerList = layers.map((layer: Layer, index: number) => (
        <DraggableLayer
            layer={layer}
            index={index}
            key={index}
            handleRemoveLayer={handleRemoveLayer}
            handleDuplicateLayer={handleDuplicateLayer}
            handleChooseAction={handleChooseAction}
            handleChooseAlternativeAction={handleChooseAlternativeAction}
            isReadOnly={false}
            character={character}
            conditions={conditions}
            handleChooseCondition={handleChooseCondition}
            handleRemoveCondition={handleRemoveCondition}
            handleInvertCondition={handleInvertCondition}
            combos={combos}
            handleChooseCombo={handleSelectCombo}
            handleChangeCondition={handleChangeCondition}
            isActive={activeMs == index + 1}
            features={features}
            actions={actions}
            toggleIsLayerSui={handleToggleIsLayerSui}
            setLayerProbability={handleSetLayerProbability}
            isAnimationRunning={isAnimationRunning}
        />
    ));

    const closeComboEditor = () => {
        changeSelectedCombo(-1);
    };

    function handleValidateCombo(combo: Action[], index: number) {
        let prev_copy = JSON.parse(JSON.stringify(combos));
        prev_copy[index] = combo;
        setCombos(prev_copy);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between',
            }}
        >
            <Box sx={{ padding: '0.5rem 0.5rem 2rem 0.5rem' }}>
                <Grid container>
                    <Grid item xs={10} marginBottom={'16px'}>
                        <Typography sx={{ fontSize: '17px', color: '#000000' }}>
                            Mind
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Box
                            sx={{
                                border: '1px solid',
                                borderColor: `${
                                    activeMs == 0 ? '#000' : '#ccc'
                                }`,
                                opacity: activeMs == 0 ? 1 : 0.5,

                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography
                                paddingLeft={'8px'}
                                paddingRight={'8px'}
                                sx={{
                                    fontFamily: 'Eurostile',
                                    color: activeMs == 0 ? '#000' : '#ccc',
                                }}
                                align="right"
                            >
                                SHOSHIN
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={10} marginBottom={'16px'}>
                        {features.layerAddAndDelete ? (
                            <Button
                                onClick={(_) => {
                                    handleCreateLayer();
                                }}
                                style={{
                                    fontFamily: 'Eurostile',
                                    color: '#000',
                                }}
                            >
                                <AddIcon sx={{ mr: '3px' }} />
                                {'LAYER'}
                            </Button>
                        ) : (
                            <div />
                        )}
                    </Grid>

                    <Grid item xs={2}>
                        {onResetClick && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',

                                    alignItems: 'flex-end',
                                }}
                            >
                                <Button
                                    sx={{
                                        width: '100px',
                                        alignSelf: 'flex-end',
                                    }}
                                    variant={'text'}
                                    onClick={onResetClick}
                                >
                                    Start Over
                                </Button>
                            </div>
                        )}
                    </Grid>
                </Grid>
                <Grid container>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <div
                                    style={{ width: '100%' }}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <Grid container sx={{ mb: 1 }} spacing={2}>
                                        <Grid item xs={gridOrderPortion}>
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    fontFamily: 'Eurostile',
                                                    color: '#000000',
                                                }}
                                            >
                                                Order
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            md={gridConditionPortionMd}
                                            xl={gridConditionPortionXl}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    fontFamily: 'Eurostile',
                                                    color: '#000000',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Condition
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            md={gridActionPortion - 0.2}
                                            xl={gridActionPortion - 0.2}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    fontFamily: 'Eurostile',
                                                    color: '#000000',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Action
                                            </Typography>
                                        </Grid>

                                        <Grid
                                            item
                                            md={checkboxPortion}
                                            xl={checkboxPortion}
                                            sx={{ pl: 0 }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    fontFamily: 'Eurostile',
                                                    color: '#000000',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Pro
                                            </Typography>
                                        </Grid>

                                        {/* <Grid
                                            item
                                            md={suiCheckboxPortion}
                                            xl={suiCheckboxPortion}
                                            sx={{ pl: 0 }}
                                        >
                                            {features.sui && (
                                                <Tooltip
                                                    title={
                                                        <div>
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        '16px',
                                                                }}
                                                            >
                                                                Stay-Until-Invalid
                                                                (SUI)
                                                            </p>
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        '16px',
                                                                }}
                                                            >
                                                                With SUI, the
                                                                mind will stay
                                                                at this layer
                                                                until its
                                                                condition
                                                                becomes invalid,
                                                                which then
                                                                returns the mind
                                                                back to SHOSHIN
                                                                immediately.
                                                            </p>
                                                        </div>
                                                    }
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '13px',
                                                            fontFamily:
                                                                'Eurostile',
                                                            color: '#000000',
                                                        }}
                                                    >
                                                        SUI
                                                    </Typography>
                                                </Tooltip>
                                            )}
                                        </Grid>

                                        <Grid
                                            item
                                            md={randCheckboxPortion}
                                            xl={randCheckboxPortion}
                                            sx={{ pl: 0 }}
                                        >
                                            {features.actionRandomness && (
                                                <Tooltip
                                                    title={
                                                        <div>
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        '16px',
                                                                }}
                                                            >
                                                                {'\u{2684}'}
                                                            </p>
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        '16px',
                                                                }}
                                                            >
                                                                Action
                                                                randomness.
                                                                Currently,
                                                                probability is
                                                                set to 50% if
                                                                toggle is turned
                                                                on.
                                                            </p>
                                                        </div>
                                                    }
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '13px',
                                                            fontFamily:
                                                                'Eurostile',
                                                            color: '#000000',
                                                        }}
                                                    >
                                                        RAND
                                                    </Typography>
                                                </Tooltip>
                                            )}
                                        </Grid> */}

                                        {/* <Grid item md={gridRemovePortion} xl={gridRemovePortion} sx={{pl:0}}>
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    fontFamily: 'Eurostile',
                                                    color: '#000000',
                                                }}
                                            >
                                                Remove
                                            </Typography>
                                        </Grid> */}
                                    </Grid>

                                    {layerList}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Grid>
            </Box>
            {selectedCombo >= 0 && combos[selectedCombo] !== undefined ? (
                <Box
                    sx={{
                        padding: '0.5rem 0.5rem 2rem 0.5rem',
                        borderTop: '1px solid #999999',
                        height: '40vh',
                    }}
                >
                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        width={'100%'}
                    >
                        <Typography
                            sx={{ fontSize: '17px' }}
                            variant="h1"
                            marginTop={'8px'}
                        >
                            <span style={{ marginRight: '8px' }}>
                                &#128165;
                            </span>
                            {`Editing Combo ${selectedCombo}`}
                        </Typography>
                        <IconButton
                            sx={{ color: '#999999' }}
                            aria-label="delete"
                            onClick={closeComboEditor}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <ComboEditor
                        editingCombo={combos[selectedCombo]}
                        isReadOnly={false}
                        characterIndex={characterIndex}
                        selectedIndex={selectedCombo}
                        handleValidateCombo={handleValidateCombo}
                        actions={actions}
                    />
                </Box>
            ) : null}
        </Box>
    );
};

export default memo(Gambit);
