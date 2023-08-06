import React, { useEffect, useRef, useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import { ACTION_UNICODE_MAP, Character } from '../../../constants/constants';
import BlurrableButton from '../../ui/BlurrableButton';
import {
    Layer,
    defaultLayer,
    alwaysTrueCondition,
    LayerCondition,
} from '../../../types/Layer';
import { Condition, conditionTypeToEmojiFile } from '../../../types/Condition';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BlurrableListItemText from '../../ui/BlurrableListItemText';
import { Action, CHARACTERS_ACTIONS } from '../../../types/Action';
import styles from './Gambit.module.css';
import ComboEditor from '../ComboEditor';
import CloseIcon from '@mui/icons-material/Close';
import { FileCopy, MoreHoriz, VerticalAlignCenter } from '@mui/icons-material';
import Actions from '../../ComboEditor/Actions';
import SingleCondition, { ConditionLabel } from './Condition';

//We have nested map calls in our render so we cannot access layer index from action/condition click
// I think we can just parse this index from id={....}
let currentMenu = 0;
let currentConditionMenu = 0;

let gridOrderPortion = 1.2;
let gridConditionPortionXl = 5;
let gridConditionPortionMd = 5;
let gridActionPortion = 4;
let checkboxPortion = 0.9;
let gridRemovePortion = 0.9;

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
}
export const FullGambitFeatures: GambitFeatures = {
    layerAddAndDelete: true,
    conditionAnd: true,
    combos: true,
    sui: true,
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
    isAnimationRunning,
}: LayerProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [conditionIndex, changeConditionIndex] = useState<number>(-1);

    const [conditionAnchorEl, setConditionAnchorEl] =
        useState<null | HTMLElement>(null);

    const [layerOptionsMenuOpen, setLayerOptionsMenuOpen] = useState(false);

    const moreOptionsButtonRef = useRef();

    let characterIndex = Object.keys(Character).indexOf(character);

    const open = Boolean(anchorEl);

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

        setAnchorEl(null);
    };

    const onConditionSelect = (condition: Condition) => {
        handleChooseCondition(condition, conditionIndex);
        setAnchorEl(null);
        setConditionAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        let id = event.currentTarget.id.split('-');
        let menuIndex = parseInt(id[id.length - 1]);
        currentMenu = menuIndex;
        setAnchorEl(event.currentTarget);
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

    const handleCloseActionDropdown = () => {
        setAnchorEl(null);
    };

    const handleCloseConditionDropdown = () => {
        setConditionAnchorEl(null);
    };

    const handleConditionValueChange = (condition, index) => {
        handleChangeCondition(condition, index, i);
    };

    const action: Action = actionIndexToAction(layer.action.id, characterIndex);

    return (
        <Box
            key={`button-wrapper-${i}`}
            sx={{
                width: '100%',
                border: `1px solid ${isActive ? '#000' : '#ccc'}`,
                background: isActive ? '#ffffffCC' : '00000000',
                marginBottom: '4px',
                borderRadius: '20px',
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
                            />
                        ))}

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
                                <AddIcon />
                            </IconButton>
                        ) : null}
                    </Box>
                </Grid>
                <Menu
                    id={`conditions-menu-${i}`}
                    anchorEl={conditionAnchorEl}
                    open={conditionsOpen}
                    onClose={(e) => handleCloseConditionDropdown()}
                    PaperProps={{
                        style: {
                            maxHeight: 220,
                            backgroundColor: '#000',
                        },
                    }}
                >
                    {conditions.map((condition) => {
                        return (
                            <MenuItem>
                                <BlurrableListItemText
                                    onClick={(e) => {
                                        onConditionSelect(condition);
                                    }}
                                >
                                    <ConditionLabel
                                        name={condition.displayName}
                                        type={condition.type}
                                    />
                                </BlurrableListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>
                <Grid item md={gridActionPortion} xl={gridActionPortion}>
                    <BlurrableButton
                        className={`${styles.gambitButton} ${styles.actionButton}`}
                        key={`${i}`}
                        id={`condition-btn-${i}`}
                        onClick={handleClick}
                        style={{
                            fontFamily: 'Eurostile',
                            fontSize: '15px',
                            padding: '8px 14px',
                            lineHeight: '9px',
                        }}
                    >
                        <span style={{ marginRight: '7px' }}>
                            {action.display.unicode}
                        </span>{' '}
                        {action.display.name}
                    </BlurrableButton>
                </Grid>
                <Menu
                    id={`actions-menu-${i}`}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseActionDropdown}
                >
                    {actionsDisplayNames.map((action) => {
                        return (
                            <MenuItem>
                                <BlurrableListItemText
                                    onClick={(e) => onActionSelect(action)}
                                >
                                    <span style={{ marginRight: '7px' }}>
                                        {ACTION_UNICODE_MAP[action]}
                                    </span>
                                    {action.replaceAll('_', ' ')}
                                </BlurrableListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>
                {features.sui && (
                    <Grid item xs={checkboxPortion}>
                        <Switch
                            size="small"
                            onChange={() => {
                                toggleIsLayerSui(i);
                            }}
                            checked={layer.sui}
                        />
                    </Grid>
                )}

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
    let componentAddLayer = (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                {features.layerAddAndDelete ? (
                    <Button
                        onClick={(_) => {
                            handleCreateLayer();
                        }}
                        style={{ fontFamily: 'Eurostile', color: '#000' }}
                    >
                        <AddIcon sx={{ mr: '3px' }} />
                        {'LAYER'}
                    </Button>
                ) : (
                    <div />
                )}

                <Box
                    sx={{
                        border: '1px solid',
                        borderColor: `${activeMs == 0 ? '#000' : '#ccc'}`,
                        opacity: activeMs == 0 ? 1 : 0.5,
                    }}
                >
                    <Typography
                        paddingLeft={'8px'}
                        paddingRight={'8px'}
                        sx={{
                            fontFamily: 'Eurostile',
                            color: activeMs == 0 ? '#000' : '#ccc',
                        }}
                    >
                        SHOSHIN
                    </Typography>
                </Box>
            </Box>
        </>
    );

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
        updatedArray.splice(
            index + 1,
            0,
            JSON.parse(JSON.stringify(layers[index]))
        );

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

    console.log('selected combo', selectedCombo, 'combos', combos);
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
                <Typography sx={{ fontSize: '17px', color: '#000000' }}>
                    Mind
                </Typography>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: '16px',
                    }}
                >
                    {componentAddLayer}
                </div>

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
                                                            With SUI, the mind
                                                            will stay at this
                                                            layer until its
                                                            condition becomes
                                                            invalid, which then
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
                                                        fontFamily: 'Eurostile',
                                                        color: '#000000',
                                                    }}
                                                >
                                                    SUI
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
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

export default Gambit;
