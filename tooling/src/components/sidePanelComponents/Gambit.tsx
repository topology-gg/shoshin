import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    ListItemText,
    MenuItem,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import { Character, CHARACTERS_ACTIONS } from '../../constants/constants';
import BlurrableButton from '../ui/BlurrableButton';
import { Layer, defaultLayer } from '../../types/Layer';
import { Condition } from '../../types/Condition';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

//We have nested map calls in our render so we cannot access layer index from action/condition click
let currentMenu = 0;
let currentConditionMenu = 0;

const actionToStr = (action: number, characterIndex) => {
    if (action < 100) {
        return CHARACTERS_ACTIONS[characterIndex][action]?.replace('_', ' ');
    }
    return `Combo ${action - 101}`;
};
interface GambitProps {
    layers: Layer[];
    isReadOnly: boolean;
    setLayers: (layers: Layer[]) => void;
    character: Character;
    conditions: Condition[];
    combos: number[][];
}

interface LayerProps {
    layer: Layer;
    index: number;
    isReadOnly: boolean;
    character: Character;
    conditions: Condition[];
    combos: number[][];
    handleRemoveLayer: (index: number) => void;
    handleChooseAction: (
        actionName: string,
        isCombo: boolean,
        comboDuration: number
    ) => void;
    handleChooseCondition: (condition: Condition) => void;
}

const DraggableLayer = ({
    layer,
    index,
    isReadOnly,
    character,
    conditions,
    combos,
    handleChooseAction,
    handleChooseCondition,
    handleRemoveLayer,
}: LayerProps) => {
    return (
        <Draggable draggableId={index.toString()} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
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
                    />
                </div>
            )}
        </Draggable>
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
    handleRemoveLayer,
}: LayerProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [conditionAnchorEl, setConditionAnchorEl] =
        useState<null | HTMLElement>(null);

    let characterIndex = Object.keys(Character).indexOf(character);

    const open = Boolean(anchorEl);

    const conditionsOpen = Boolean(conditionAnchorEl);

    let actions = Object.keys(CHARACTERS_ACTIONS[characterIndex]).filter((a) =>
        isNaN(parseInt(a))
    );

    combos.forEach((_, i) => {
        actions.push(`Combo ${i}`);
    });

    const onActionSelect = (action: string) => {
        if (!action.includes('Combo')) {
            handleChooseAction(action, false, -1);
        } else {
            let comboNumber = parseInt(action.split(' ')[1]);
            const comboDuration = combos[comboNumber].length;
            handleChooseAction(
                (101 + comboNumber).toString(),
                true,
                comboDuration
            );
        }

        setAnchorEl(null);
    };

    const onConditionSelect = (condition: Condition) => {
        handleChooseCondition(condition);
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        let id = event.currentTarget.id.split('-');
        let menuIndex = parseInt(id[id.length - 1]);
        currentMenu = menuIndex;
        setAnchorEl(event.currentTarget);
    };

    const handleConditionClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        let id = event.currentTarget.id.split('-');
        let menuIndex = parseInt(id[id.length - 1]);
        currentConditionMenu = menuIndex;
        setConditionAnchorEl(event.currentTarget);
    };

    const handleCloseActionDropdown = () => {
        setAnchorEl(null);
    };

    const handleCloseConditionDropdown = () => {
        setConditionAnchorEl(null);
    };

    return (
        <Grid xs={12}>
            <Box
                key={`button-wrapper-${i}`}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: '2rem',
                    pl: '0.5rem',
                    width: '100%',
                }}
            >
                <Grid item xs={1}>
                    {i + 1}
                </Grid>
                <Grid item xs={4}>
                    <BlurrableButton
                        className={'mentalStateButton'}
                        key={`${i}`}
                        id={`condition-btn-${i}`}
                        onClick={handleConditionClick}
                        style={{
                            fontFamily: 'Raleway',
                            fontSize: '14px',
                            padding: '8px',
                            lineHeight: '9px',
                        }}
                    >
                        {layer.condition.displayName}
                    </BlurrableButton>
                </Grid>
                <Menu
                    id={`conditions-menu-${i}`}
                    anchorEl={conditionAnchorEl}
                    open={conditionsOpen}
                    onClose={(e) => handleCloseConditionDropdown()}
                >
                    {conditions.map((condition) => {
                        return (
                            <MenuItem>
                                <ListItemText
                                    onClick={(e) =>
                                        onConditionSelect(condition)
                                    }
                                >
                                    {condition.displayName}
                                </ListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>
                <Grid item xs={4}>
                    <Button
                        id={`actions-button-${i}`}
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        disabled={isReadOnly}
                    >
                        <span style={{ marginRight: '7px' }}>&#129354;</span>{' '}
                        {actionToStr(layer.action.id, characterIndex)}
                    </Button>
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
                                <ListItemText
                                    onClick={(e) => onActionSelect(action)}
                                >
                                    {action.replaceAll('_', ' ')}
                                </ListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>
                <Grid item xs={1}>
                    <IconButton
                        onClick={(_) => handleRemoveLayer(i)}
                        disabled={isReadOnly}
                        style={{ marginLeft: 'auto' }}
                    >
                        <DeleteIcon sx={{ fontSize: 'small' }} />
                    </IconButton>
                </Grid>
            </Box>
        </Grid>
    );
};

const Gambit = ({
    isReadOnly,
    layers,
    setLayers,
    character,
    conditions,
    combos,
}: GambitProps) => {
    const handleCreateLayer = () => {
        setLayers([defaultLayer, ...layers]);
    };

    let characterIndex = Object.keys(Character).indexOf(character);

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
                    {'Add Layer'} <AddIcon />
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

    const handleChooseAction = (
        actionName: string,
        isCombo: boolean,
        comboDuration: number
    ) => {
        let updatedLayers = layers.map((layer, index) => {
            if (index == currentMenu) {
                return {
                    ...layer,
                    action: {
                        id: isCombo
                            ? actionName
                            : CHARACTERS_ACTIONS[characterIndex][actionName],
                        isCombo,
                        comboDuration,
                    },
                };
            }
            return layer;
        });
        setLayers(updatedLayers);
    };

    const handleChooseCondition = (condition) => {
        let updatedLayers = layers.map((layer, index) => {
            if (index == currentConditionMenu) {
                return {
                    ...layer,
                    condition,
                };
            }
            return layer;
        });
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
                combos={combos}
            />
        ));
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'left',
                alignItems: 'left',
                pt: '1rem',
                pl: '2rem',
            }}
        >
            <Typography sx={{ fontSize: '17px' }} variant="overline">
                <span style={{ marginRight: '8px' }}>&#129504;</span>Gambit
            </Typography>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                {isReadOnly ? <></> : componentAddLayer}
            </div>

            <Grid container>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="list">
                        {(provided) => (
                            <div
                                style={{ width: '100%' }}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <Grid container>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            ml: '2rem',
                                            pl: '0.5rem',
                                            width: '100%',
                                        }}
                                    >
                                        <Grid item xs={1}>
                                            Order
                                        </Grid>
                                        <Grid item xs={4}>
                                            Condition
                                        </Grid>
                                        <Grid item xs={4}>
                                            Action
                                        </Grid>
                                        <Grid item xs={1}>
                                            Remove
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
    );
};

export default Gambit;
