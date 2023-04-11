import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Grid, Autocomplete, Select, MenuItem } from "@mui/material";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import TextField from '@mui/material/TextField';
import { ConditionElement, Operator, ElementType, Perceptible, Condition, isPerceptibleBodyState, isOperatorWithDoubleOperands, conditionElementToStr, validateConditionName } from '../../types/Condition'
import PerceptibleList from './PerceptibleList'
import { BodystatesAntoc, BodystatesJessica } from '../../types/Condition';
import ConditionEditor from '../ConditionEditor';

// Interfaces

interface ConditionsProps {
    conditions: Condition[]
    handleUpdateCondition: (index: number, element: ConditionElement, name: string) => void
    handleConfirmCondition: () => void
    handleClickDeleteCondition: (index: number) => void
    conditionUnderEditIndex: number
    setConditionUnderEditIndex: (index: number) => void
    isWarningTextOn: boolean
    warningText: string
    handleRemoveConditionElement: (index: number) => void
    isReadOnly: boolean,
    handleSaveCondition: (index: number, conditionElements: ConditionElement[]) => void
}

interface BodyStateOption {
    group: string
    name: string
    bodystate: number
}

interface ConditionEditErrors{
    isValidCondition : boolean,
    conditionErrorText : string,
    isValidDisplayName : boolean,
    namingErrorText : string
}

const Conditions = ({
    isReadOnly, conditions, handleUpdateCondition, handleClickDeleteCondition,
    conditionUnderEditIndex, setConditionUnderEditIndex, handleRemoveConditionElement, handleSaveCondition
}: ConditionsProps) => {
    let f = conditions[conditionUnderEditIndex]
    const [updatedConditionElements, setConditionElements] = useState<ConditionElement[]>(conditions[conditionUnderEditIndex].elements);
    const [initialConditionElement, setInititalConditionElements] = useState<ConditionElement[]>(conditions[conditionUnderEditIndex].elements);

    const [conditionErrors, setConditionEditErrors] = useState<ConditionEditErrors>({
        isValidCondition : false,
        conditionErrorText : "",
        isValidDisplayName : true,
        namingErrorText : ""
    })

    const isDisabled = conditionErrors.isValidCondition && conditionErrors.isValidDisplayName;

    useEffect(() => {
        setConditionElements(conditions[conditionUnderEditIndex].elements)
        setInititalConditionElements(conditions[conditionUnderEditIndex].elements)
    }, [conditionUnderEditIndex])
    
    const handleSetConditionElements = (is_valid : boolean, elements : ConditionElement[], warningText : string) => {
        setConditionEditErrors({...conditionErrors, isValidCondition : is_valid, conditionErrorText : warningText})
    
        if(elements.length){
            setConditionElements(elements)
        }
    }

    const handleSaveClick = () => {
        handleSaveCondition(conditionUnderEditIndex, updatedConditionElements)
    }

    const handleUpdateUsername = (e) => {
        
        handleUpdateCondition(conditionUnderEditIndex, undefined, e.target.value)
        const excludingSelectedCondition = conditions.filter((_, i) => conditionUnderEditIndex != i)
        const nameError = validateConditionName( e.target.value, excludingSelectedCondition);
        setConditionEditErrors({...conditionErrors, isValidDisplayName : !nameError, namingErrorText : nameError ? nameError : ''})
        if(!nameError){
            handleUpdateCondition(conditionUnderEditIndex, undefined, e.target.value)
        }
    }
        
    
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "left",
                pt: "1rem",
                pl: '1rem',
                pr: '1rem',
        }}>
            <Typography sx={{ fontSize: '17px' }} variant='overline'>Conditions</Typography>
            <Grid container spacing={1}>
                <Grid
                    xs={ 12 }
                    item
                    className='available-conditions'
                >
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <Select
                            value={conditionUnderEditIndex}
                            size="small"
                            fullWidth
                            onChange={(event) => setConditionUnderEditIndex(event.target.value as number)}
                        >
                            {conditions.slice(0, conditions.length - 1).map((_, i) =>
                                <MenuItem value={i}>
                                    {conditions[i].displayName || `F${i}`}
                                </MenuItem>
                            )}
                            <MenuItem value={conditions.length - 1} disabled={isReadOnly}>New Condition</MenuItem>
                        </Select>

                        <div>
                            <IconButton
                                aria-label="delete" onClick={() => handleClickDeleteCondition(conditionUnderEditIndex)}
                                disabled={isReadOnly || conditionUnderEditIndex === conditions.length - 1 || conditions.length < 3}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </Box>
                </Grid>

                {/* { handleDisplayText(isReadOnly, isWarningTextOn, warningText, conditionUnderEditIndex) } */}

                <Grid xs={ 12 } item sx={{mt: 1, mb: 2}}>
                    <TextField
                        label="Condition Name"
                        size="small"
                        // fullWidth
                        sx = {{width:'400px'}}
                        value={f.displayName || ""}
                        onChange={handleUpdateUsername}
                    />
                </Grid>

                <ConditionEditor setConditionElements={handleSetConditionElements} initialConditionElements={initialConditionElement} />

                {conditionErrors.conditionErrorText.length ?
                    <Grid item xs={12}>
                    <Typography color={'red'} variant='overline'>{conditionErrors.conditionErrorText}</Typography>
                    </Grid>
                    : null
                }
                {conditionErrors.namingErrorText.length ?
                    <Grid item xs={12}>
                    <Typography color={'red'} variant='overline'>{conditionErrors.namingErrorText}</Typography>
                    </Grid>
                    : null
                }

                {
                    isReadOnly ? <></> : (
                        <>
                            <Grid item xs={12}>
                                <Button
                                    id={`confirm-gp-function`}
                                    variant="outlined"
                                    size="medium"
                                    disabled={!isDisabled}
                                    // className={ styles.confirm }
                                    onClick={() => handleSaveClick()}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </>
                    )
                }

            </Grid>
        </Box>
    )
}

export default Conditions;
