import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Grid,
    Autocomplete,
    Select,
    MenuItem,
    Menu,
    Tooltip,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import SaveIcon from '@mui/icons-material/Save';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import BackspaceIcon from '@mui/icons-material/Backspace';
import TextField from '@mui/material/TextField';
import {
    ConditionElement,
    Operator,
    ElementType,
    Perceptible,
    Condition,
    isPerceptibleBodyState,
    isOperatorWithDoubleOperands,
    conditionElementToStr,
    validateConditionName,
} from '../../types/Condition';
import PerceptibleList from './PerceptibleList';
import { BodystatesAntoc, BodystatesJessica } from '../../types/Condition';
import ConditionEditor from '../ConditionEditor';

// Interfaces

interface ConditionsProps {
    conditions: Condition[];
    handleUpdateCondition: (
        index: number,
        element: ConditionElement,
        name: string
    ) => void;
    handleConfirmCondition: () => void;
    handleClickDeleteCondition: (index: number) => void;
    conditionUnderEditIndex: number;
    setConditionUnderEditIndex: (index: number) => void;
    isWarningTextOn: boolean;
    warningText: string;
    handleRemoveConditionElement: (index: number) => void;
    isReadOnly: boolean;
    handleSaveCondition: (
        index: number,
        conditionElements: ConditionElement[]
    ) => void;
}

interface BodyStateOption {
    group: string;
    name: string;
    bodystate: number;
}

interface ConditionEditErrors {
    isValidCondition: boolean;
    conditionErrorText: string;
    isValidDisplayName: boolean;
    namingErrorText: string;
}

export const ConditionShortcuts = ['xDistanceLte'];

const Conditions = ({
    isReadOnly,
    conditions,
    handleUpdateCondition,
    handleClickDeleteCondition,
    conditionUnderEditIndex,
    setConditionUnderEditIndex,
    handleRemoveConditionElement,
    handleSaveCondition,
}: ConditionsProps) => {
    let f = conditions[conditionUnderEditIndex];
    const [updatedConditionElements, setConditionElements] = useState<
        ConditionElement[]
    >(conditions[conditionUnderEditIndex].elements);
    const [initialConditionElement, setInititalConditionElements] = useState<
        ConditionElement[]
    >(conditions[conditionUnderEditIndex].elements);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleShortcutClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    const handleShortcutClose = () => {
        setAnchorEl(null);
    };

    const xDistanceClick = () => {
        setShortcutsButtonClickCounts((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy['xDistanceLte'] += 1;
            return prev_copy;
        });
        handleShortcutClose();
    };

    const [shortcutsButtonClickCounts, setShortcutsButtonClickCounts] =
        useState<{ [key: string]: number }>({ xDistanceLte: 0 });

    const [conditionErrors, setConditionEditErrors] =
        useState<ConditionEditErrors>({
            isValidCondition: false,
            conditionErrorText: '',
            isValidDisplayName: true,
            namingErrorText: '',
        });

    const isDisabled =
        conditionErrors.isValidCondition && conditionErrors.isValidDisplayName;

    useEffect(() => {
        setConditionElements(conditions[conditionUnderEditIndex].elements);
        setInititalConditionElements(
            conditions[conditionUnderEditIndex].elements
        );
    }, [conditionUnderEditIndex]);

    const handleSetConditionElements = (
        is_valid: boolean,
        elements: ConditionElement[],
        warningText: string
    ) => {
        setConditionEditErrors({
            ...conditionErrors,
            isValidCondition: is_valid,
            conditionErrorText: warningText,
        });

        if (elements.length) {
            setConditionElements(elements);
        }
    };

    const handleSaveClick = () => {
        handleSaveCondition(conditionUnderEditIndex, updatedConditionElements);
    };

    const handleUpdateUsername = (e) => {
        handleUpdateCondition(
            conditionUnderEditIndex,
            undefined,
            e.target.value
        );
        const excludingSelectedCondition = conditions.filter(
            (_, i) => conditionUnderEditIndex != i
        );
        const nameError = validateConditionName(
            e.target.value,
            excludingSelectedCondition
        );
        setConditionEditErrors({
            ...conditionErrors,
            isValidDisplayName: !nameError,
            namingErrorText: nameError ? nameError : '',
        });
        if (!nameError) {
            handleUpdateCondition(
                conditionUnderEditIndex,
                undefined,
                e.target.value
            );
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'left',
                pt: '1rem',
                pl: '1rem',
                pr: '1rem',
            }}
        >
            <Typography sx={{ fontSize: '17px' }} variant="overline">
                <span style={{ marginRight: '8px' }}>&#128208;</span>Conditions
            </Typography>

            <Grid container spacing={1}>
                <Grid xs={12} item className="available-conditions">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ListIcon />

                        <Select
                            value={conditionUnderEditIndex}
                            size="small"
                            // fullWidth
                            sx={{ width: '300px' }}
                            onChange={(event) =>
                                setConditionUnderEditIndex(
                                    event.target.value as number
                                )
                            }
                        >
                            {conditions
                                .slice(0, conditions.length - 1)
                                .map((_, i) => (
                                    <MenuItem value={i}>
                                        {conditions[i].displayName || `C${i}`}
                                    </MenuItem>
                                ))}
                            <MenuItem
                                value={conditions.length - 1}
                                disabled={isReadOnly}
                            >
                                New Condition
                            </MenuItem>
                        </Select>
                    </Box>
                </Grid>

                {/* { handleDisplayText(isReadOnly, isWarningTextOn, warningText, conditionUnderEditIndex) } */}

                <Grid xs={9.5} item sx={{ mt: 1, mb: 2 }}>
                    <Grid xs={12} item sx={{ mt: 1, mb: 2 }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <TextField
                                label="Condition Name"
                                size="small"
                                // fullwidth
                                sx={{ width: '300px' }}
                                value={f.displayName || ''}
                                onChange={handleUpdateUsername}
                            />

                            <div>
                                <Tooltip title="Delete">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() =>
                                            handleClickDeleteCondition(
                                                conditionUnderEditIndex
                                            )
                                        }
                                        disabled={
                                            isReadOnly ||
                                            conditionUnderEditIndex ===
                                                conditions.length - 1 ||
                                            conditions.length < 3
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div>
                                <Tooltip title="Shortcuts">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={handleShortcutClick}
                                        disabled={isReadOnly}
                                    >
                                        <ElectricBoltIcon />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={anchorEl !== null}
                                    onClose={handleShortcutClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={xDistanceClick}>
                                        X-Distance ≤
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </Grid>

                    {isReadOnly ? (
                        <></>
                    ) : (
                        <Grid container spacing={1}>
                            <Box display={'flex'}>
                                <ConditionEditor
                                    shortcutsButtonClickCounts={
                                        shortcutsButtonClickCounts
                                    }
                                    setConditionElements={
                                        handleSetConditionElements
                                    }
                                    initialConditionElements={
                                        initialConditionElement
                                    }
                                />
                            </Box>
                            {conditionErrors.conditionErrorText.length ? (
                                <Grid item xs={12}>
                                    <Typography
                                        color={'red'}
                                        variant="overline"
                                    >
                                        {conditionErrors.conditionErrorText}
                                    </Typography>
                                </Grid>
                            ) : null}
                            {conditionErrors.namingErrorText.length ? (
                                <Grid item xs={12}>
                                    <Typography
                                        color={'red'}
                                        variant="overline"
                                    >
                                        {conditionErrors.namingErrorText}
                                    </Typography>
                                </Grid>
                            ) : null}

                            <Grid item xs={12}>
                                <Button
                                    id={`confirm-gp-function`}
                                    variant="outlined"
                                    size="medium"
                                    disabled={!isDisabled}
                                    // className={ styles.confirm }
                                    onClick={() => handleSaveClick()}
                                >
                                    <SaveIcon />
                                    <span style={{ width: '6px' }}></span>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Conditions;
