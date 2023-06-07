import React, { useMemo, useState } from 'react';
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
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import { MentalState } from '../../types/MentalState';
import { Character, CHARACTERS_ACTIONS } from '../../constants/constants';
import { getMentalStatesNames } from '../../types/Tree';
import MentalStatesGraph from './MentalStatesGraph';
import BlurrableButton from '../ui/BlurrableButton';
import { Layer, defaultLayer } from '../../types/Layer';
import { Condition } from '../../types/Condition';

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
}

const Gambit = ({
    isReadOnly,
    layers,
    setLayers,
    character,
    conditions,
}: GambitProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [conditionAnchorEl, setConditionAnchorEl] =
        useState<null | HTMLElement>(null);

    const [mentalState, setMentalState] = useState<string>(null);

    let characterIndex = Object.keys(Character).indexOf(character);

    const open = Boolean(anchorEl);

    const conditionsOpen = Boolean(conditionAnchorEl);

    let actions = Object.keys(CHARACTERS_ACTIONS[characterIndex]).filter((a) =>
        isNaN(parseInt(a))
    );
    const handleCreateLayer = () => {
        setLayers([defaultLayer, ...layers]);
    };

    const handleRemoveLayer = (index: number) => {
        //TODO check if deleting last layer breaks things
        setLayers(layers.splice(index, 1));
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

    const handleChooseAction = (actionName) => {
        let updatedLayers = layers.map((layer, index) => {
            if (index == currentMenu) {
                return {
                    ...layer,
                    action: CHARACTERS_ACTIONS[characterIndex][actionName],
                };
            }
            return layer;
        });
        setLayers(updatedLayers);
        setAnchorEl(null);
    };

    const handleCloseActionDropdown = () => {
        setAnchorEl(null);
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
        setConditionAnchorEl(null);
    };

    const handleCloseConditionDropdown = () => {
        setConditionAnchorEl(null);
    };

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
                <IconButton
                    onClick={(_) => {
                        handleCreateLayer();
                    }}
                    disabled={isReadOnly}
                >
                    <AddIcon />
                </IconButton>
            </Grid>
        </>
    );

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
                {layers.map((layer, i) => {
                    return (
                        <Grid xs={12}>
                            <Box
                                key={`button-wrapper-${i}`}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    ml: '2rem',
                                    pl: '0.5rem',
                                }}
                            >
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

                                <Menu
                                    id={`conditions-menu-${i}`}
                                    anchorEl={conditionAnchorEl}
                                    open={conditionsOpen}
                                    onClose={(e) =>
                                        handleCloseConditionDropdown()
                                    }
                                >
                                    {conditions.map((condition) => {
                                        return (
                                            <MenuItem>
                                                <ListItemText
                                                    onClick={(e) =>
                                                        handleChooseCondition(
                                                            condition
                                                        )
                                                    }
                                                >
                                                    {condition.displayName}
                                                </ListItemText>
                                            </MenuItem>
                                        );
                                    })}
                                </Menu>

                                <Button
                                    id={`actions-button-${i}`}
                                    aria-controls={
                                        open ? 'basic-menu' : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    disabled={isReadOnly}
                                >
                                    <span style={{ marginRight: '7px' }}>
                                        &#129354;
                                    </span>{' '}
                                    {actionToStr(layer.action, characterIndex)}
                                </Button>

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
                                                    onClick={(e) =>
                                                        handleChooseAction(
                                                            action
                                                        )
                                                    }
                                                >
                                                    {action.replaceAll(
                                                        '_',
                                                        ' '
                                                    )}
                                                </ListItemText>
                                            </MenuItem>
                                        );
                                    })}
                                </Menu>

                                <IconButton
                                    onClick={(_) => handleRemoveLayer(i)}
                                    disabled={isReadOnly}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    <DeleteIcon sx={{ fontSize: 'small' }} />
                                </IconButton>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default Gambit;
