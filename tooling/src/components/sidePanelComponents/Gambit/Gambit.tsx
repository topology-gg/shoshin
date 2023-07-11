import React, { useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import { ACTION_UNICODE_MAP, Character } from '../../../constants/constants';
import BlurrableButton from '../../ui/BlurrableButton';
import { Layer, defaultLayer, alwaysTrueCondition } from '../../../types/Layer';
import { Condition, conditionTypeToEmojiFile } from '../../../types/Condition';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BlurrableListItemText from '../../ui/BlurrableListItemText';
import { Action, CHARACTERS_ACTIONS } from '../../../types/Action';
import styles from './Gambit.module.css';
import ComboEditor from '../ComboEditor';
import CloseIcon from '@mui/icons-material/Close';
import { VerticalAlignCenter } from '@mui/icons-material';
import Actions from '../../ComboEditor/Actions';

//We have nested map calls in our render so we cannot access layer index from action/condition click
// I think we can just parse this index from id={....}
let currentMenu = 0;
let currentConditionMenu = 0;

let gridOrderPortion = 1;
let gridConditionPortion = 5;
let gridActionPortion = 5;
let gridRemovePortion = 1;

export const conditionElement = (
    conditionName: string,
    conditionType: string,
    isInverted: boolean = false
) => {
    return (
        <Box>
            {!isInverted
                ? conditionEmojiElement(conditionType)
                : invertedConditionEmojiElement()}
            <div style={{ marginLeft: '25px' }}>{conditionName}</div>
        </Box>
    );
};
export const conditionEmojiElement = (conditionType: string) => {
    const filePath = conditionTypeToEmojiFile(conditionType);
    // doing the following to make sure image is vertically centered; sometimes css feels like dark magic
    // solution from: https://stackoverflow.com/a/11716065
    return (
        <img
            src={filePath}
            height="15px"
            style={{
                position: 'absolute',
                marginTop: 'auto',
                marginBottom: 'auto',
                top: '0',
                bottom: '0',
            }}
        />
    );
};

const invertedConditionEmojiElement = () => {
    const filePath = '/images/emojis/stop_sign.png';
    // doing the following to make sure image is vertically centered; sometimes css feels like dark magic
    // solution from: https://stackoverflow.com/a/11716065
    return (
        <img
            src={filePath}
            height="15px"
            style={{
                position: 'absolute',
                marginTop: 'auto',
                marginBottom: 'auto',
                top: '0',
                bottom: '0',
            }}
        />
    );
};

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
        };
    }
};

interface GambitProps {
    layers: Layer[];
    isReadOnly: boolean;
    setLayers: (layers: Layer[]) => void;
    character: Character;
    conditions: Condition[];
    combos: Action[][];
    setCombos: (combo: Action[][]) => void;
}

interface LayerProps {
    layer: Layer;
    index: number;
    isReadOnly: boolean;
    character: Character;
    conditions: Condition[];
    combos: Action[][];
    handleRemoveLayer: (index: number) => void;
    //Check if previously combo and close
    handleChooseAction: (actionName: string, layerIndex: number) => void;
    // -1 index is a new condition
    handleChooseCondition: (condition: Condition, index: number) => void;
    handleRemoveCondition: (layerIndex: number, conditionIndex: number) => void;
    handleInvertCondition: (layerIndex: number, conditionIndex: number) => void;
    //Layer either can make combo or edit the combo
    handleChooseCombo: (layerIndex: number) => void;
}

//Select +Combo,

//probably can use spread operator for props
const DraggableLayer = ({
    layer,
    index,
    isReadOnly,
    character,
    conditions,
    combos,
    handleChooseAction,
    handleChooseCondition,
    handleRemoveCondition,
    handleRemoveLayer,
    handleInvertCondition,
    handleChooseCombo,
}: LayerProps) => {
    return (
        <Draggable draggableId={index.toString()} index={index}>
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
                    <Layer
                        layer={layer}
                        index={index}
                        isReadOnly={isReadOnly}
                        character={character}
                        conditions={conditions}
                        combos={combos}
                        handleChooseAction={handleChooseAction}
                        handleChooseCondition={handleChooseCondition}
                        handleRemoveLayer={handleRemoveLayer}
                        handleRemoveCondition={handleRemoveCondition}
                        handleInvertCondition={handleInvertCondition}
                        handleChooseCombo={handleChooseCombo}
                    />
                </div>
            )}
        </Draggable>
    );
};

//override right click for conditions
const ConditionContextMenu = ({
    children,
    handleInvertCondition,
    layerIndex,
    conditionIndex,
}) => {
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX + 2,
                      mouseY: event.clientY - 6,
                  }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                  null
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleInvertClick = (event) => {
        handleInvertCondition(layerIndex, conditionIndex);
        setContextMenu(null);
    };

    return (
        <div onContextMenu={handleContextMenu} style={{ width: 'fit-content' }}>
            {children}
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={handleInvertClick}>
                    Invert Condition
                </MenuItem>
            </Menu>
        </div>
    );
};

const Layer = ({
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
    handleInvertCondition,
    handleChooseCombo,
}: LayerProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [conditionIndex, changeConditionIndex] = useState<number>(-1);

    const [conditionAnchorEl, setConditionAnchorEl] =
        useState<null | HTMLElement>(null);

    let characterIndex = Object.keys(Character).indexOf(character);

    const open = Boolean(anchorEl);

    const conditionsOpen = Boolean(conditionAnchorEl);

    let actions = CHARACTERS_ACTIONS[characterIndex].map((a) => a.display.name);
    actions.push(`Combo`);

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

    const handleRemoveConditionClick = (
        event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
    ) => {
        const targetId = event.currentTarget.parentElement.id;
        let id = targetId.split('-');

        let layerIndex = parseInt(id[id.length - 2]);
        let conditionIndex = parseInt(id[id.length - 1]);
        handleRemoveCondition(layerIndex, conditionIndex);
    };

    const handleCloseActionDropdown = () => {
        setAnchorEl(null);
    };

    const handleCloseConditionDropdown = () => {
        setConditionAnchorEl(null);
    };

    const action: Action = actionIndexToAction(layer.action.id, characterIndex);

    return (
        <Box
            key={`button-wrapper-${i}`}
            sx={{
                width: '100%',
                border: '1px solid #ddd',
                marginBottom: '4px',
                borderRadius: '20px',
            }}
        >
            <Grid container alignItems={'center'}>
                <Grid item xs={gridOrderPortion}>
                    <div style={{ textAlign: 'center', fontSize: '13px' }}>
                        {i + 1}
                    </div>
                </Grid>
                <Grid item md={6} xl={4}>
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        flexWrap={'wrap'}
                    >
                        {layer.conditions.map((condition, index) => (
                            <ConditionContextMenu
                                handleInvertCondition={handleInvertCondition}
                                layerIndex={i}
                                conditionIndex={index}
                            >
                                <Chip
                                    label={conditionElement(
                                        condition.displayName,
                                        condition.type,
                                        condition.isInverted
                                    )}
                                    className={
                                        !condition.isInverted
                                            ? `${styles.gambitButton} ${styles.conditionButton}`
                                            : `${styles.gambitButton} ${styles.invertedConditionButton}`
                                    }
                                    key={`${i}`}
                                    id={`condition-btn-${i}-${index}`}
                                    onClick={handleConditionClick}
                                    onDelete={
                                        layer.conditions.length > 1
                                            ? handleRemoveConditionClick
                                            : undefined
                                    }
                                    style={{
                                        fontFamily: 'Raleway',
                                        fontSize: '14px',
                                        verticalAlign: 'middle',
                                        padding: '0',
                                    }}
                                />
                            </ConditionContextMenu>
                        ))}

                        {layer.conditions.length >= 1 &&
                        !(
                            JSON.stringify(layer.conditions[0]) ===
                            JSON.stringify(alwaysTrueCondition)
                        ) ? (
                            <IconButton
                                onClick={handleConditionClick}
                                id={`condition-btn-${i}-new`}
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
                                    {conditionElement(
                                        condition.displayName,
                                        condition.type
                                    )}
                                </BlurrableListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>
                <Grid item md={4} xl={6}>
                    <BlurrableButton
                        className={`${styles.gambitButton} ${styles.actionButton}`}
                        key={`${i}`}
                        id={`condition-btn-${i}`}
                        onClick={handleClick}
                        style={{
                            fontFamily: 'Raleway',
                            fontSize: '14px',
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
                    {actions.map((action) => {
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
                <Grid item xs={gridRemovePortion}>
                    <IconButton
                        onClick={(_) => handleRemoveLayer(i)}
                        disabled={isReadOnly}
                        style={{ marginLeft: 'auto' }}
                    >
                        <DeleteIcon sx={{ fontSize: '16px', color: '#888' }} />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
};

const Gambit = ({
    isReadOnly,
    layers,
    setLayers,
    character,
    conditions,
    combos,
    setCombos,
}: GambitProps) => {
    const handleCreateLayer = () => {
        console.log('default layer is ', defaultLayer);

        // We need to make a deep copy otherwise this exported object is reassigned
        const deepCopy = JSON.parse(JSON.stringify(defaultLayer));
        // insert layer at lowest priority
        setLayers([...layers, deepCopy]);
    };

    let characterIndex = Object.keys(Character).indexOf(character);

    const [selectedCombo, changeSelectedCombo] = useState<number>(-1);

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
            <Grid
                xs={1}
                item
                sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                }}
            >
                <Button
                    onClick={(_) => {
                        handleCreateLayer();
                    }}
                    disabled={isReadOnly}
                >
                    <AddIcon sx={{ mr: '3px' }} />
                    {'Layer'}
                </Button>
            </Grid>
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

    const handleChooseAction = (actionName: string, layerIndex: number) => {
        const layer = layers[layerIndex];

        let updatedLayers: Layer[] = JSON.parse(JSON.stringify(layers));

        if (layer.action.isCombo == true) {
            updatedLayers = updatedLayers.map((layer, index) => {
                if (index < layerIndex && layer.action.isCombo == true) {
                    return {
                        ...layer,
                        action: {
                            id: layer.action.id - 1,
                            isCombo: true,
                        },
                    };
                }
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

        combos.splice(layerIndex, 1);
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
            setLayers(updatedLayers);
            setCombos([...combos, []]);
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

    const handleRemoveCondition = (layerIndex, conditionIndex) => {
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
        console.log('updated layers', updatedLayers);
        setLayers(updatedLayers);
    };

    const LayerList = React.memo(function LayerList({ layers }: any) {
        return layers.map((layer: Layer, index: number) => (
            <DraggableLayer
                layer={layer}
                index={index}
                key={index}
                handleRemoveLayer={handleRemoveLayer}
                handleChooseAction={handleChooseAction}
                isReadOnly={false}
                character={character}
                conditions={conditions}
                handleChooseCondition={handleChooseCondition}
                handleRemoveCondition={handleRemoveCondition}
                handleInvertCondition={handleInvertCondition}
                combos={combos}
                handleChooseCombo={handleSelectCombo}
            />
        ));
    });

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
                height: '100vh',
                justifyContent: 'space-between',
            }}
        >
            <Box sx={{ padding: '0.5rem 0.5rem 2rem 0.5rem' }}>
                <Typography sx={{ fontSize: '17px' }} variant="overline">
                    <span style={{ marginRight: '8px' }}>&#129504;</span>Mind
                </Typography>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: '4px',
                    }}
                >
                    {isReadOnly ? <></> : componentAddLayer}
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
                                    <Grid container sx={{ mb: 1 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                // ml: '2rem',
                                                // pl: '0.5rem',
                                                width: '100%',
                                                color: '#999',
                                                fontSize: '13px',
                                            }}
                                        >
                                            <Grid item xs={1}>
                                                <div
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Order
                                                </div>
                                            </Grid>
                                            <Grid item md={6} xl={4}>
                                                <div
                                                    style={{
                                                        paddingLeft: '8px',
                                                    }}
                                                >
                                                    Condition
                                                </div>
                                            </Grid>
                                            <Grid item md={4} xl={6}>
                                                <div
                                                    style={{
                                                        paddingLeft: '8px',
                                                    }}
                                                >
                                                    Action
                                                </div>
                                            </Grid>
                                        </Box>
                                    </Grid>

                                    <LayerList layers={layers} />
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
                            variant="overline"
                        >
                            <span style={{ marginRight: '8px' }}>
                                &#128165;
                            </span>
                            Editing Combo
                        </Typography>
                        <IconButton
                            sx={{ color: '#999999' }}
                            aria-label="delete"
                            onClick={closeComboEditor}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography>
                        Used by layers : {usedLayersByCombo}
                    </Typography>
                    <ComboEditor
                        editingCombo={combos[selectedCombo]}
                        isReadOnly={false}
                        characterIndex={characterIndex}
                        selectedIndex={selectedCombo}
                        handleValidateCombo={handleValidateCombo}
                    />
                </Box>
            ) : null}
        </Box>
    );
};

export default Gambit;
