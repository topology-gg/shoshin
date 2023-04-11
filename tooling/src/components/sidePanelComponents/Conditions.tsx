import React, { useMemo, useState } from 'react';
import { Box, Button, Chip, Grid, Autocomplete, Select, MenuItem } from "@mui/material";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import TextField from '@mui/material/TextField';
import { ConditionElement, Operator, ElementType, Perceptible, Condition, isPerceptibleBodyState, isOperatorWithDoubleOperands, conditionElementToStr } from '../../types/Condition'
import PerceptibleList from './PerceptibleList'
import { BodystatesAntoc, BodystatesJessica } from '../../types/Condition';

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
    isReadOnly: boolean
}

interface BodyStateOption {
    group: string
    name: string
    bodystate: number
}

// Constants

const BodyStates: BodyStateOption[] = (Object.entries(BodystatesJessica)
.map(([k, v]) => {
    return {group: 'jessica', name: k, bodystate: parseInt(v as string)}
})
.filter((v) => !isNaN(v.bodystate)) as BodyStateOption[])
.concat(
    Object.entries(BodystatesAntoc)
    .map(([k, v]) => {
        return {group: 'antoc', name: k, bodystate: parseInt(v as string)}
    })
    .filter((v) => !isNaN(v.bodystate)) as BodyStateOption[]
)

const conditionElementTitles = [
    { id: 'Operators', width: 5 },
    { id: 'Const', width: 3 },
    { id: 'Perceptibles', width: 4 }
]
const operatorColor = (s: string): string => {
    if (s === '(' || s === ')') return '#66FF66' //'#c4ffb4'
    if (s === 'Abs(' || s === '|') return '#FFFE71' //'#ffe38e'
    return '#ffffff'
}
const operators = Object.values(Operator)
const perceptibles = Object.keys(Perceptible).filter(x => isNaN(parseInt(x)))

const elementFromEvent = (e, currentConstant: number): ConditionElement => {
    let source = e.currentTarget.id.split('.')
    switch (source[0]) {
        case 'operator': {
            return { value: source[1], type: ElementType.Operator }
        }
        case 'constant': {
            return { value: currentConstant, type: ElementType.Constant }
        }
        case 'perceptible': {
            return { value: source[1], type: ElementType.Perceptible }
        }
    }
}

const handleDisplayText = (isReadOnly, isWarningTextOn, warningText, index) => {

    const text = index == null ? 'No conditions made' : `${isReadOnly ? 'Viewing' : 'Editing'} Condition ${index}`

    return <Grid xs={ 12 } item className='warning-test'>
            {
                isWarningTextOn && <Typography color={'red'} variant='overline'>{warningText}</Typography>
                || !isWarningTextOn && <Typography variant='overline'>{text}</Typography>
            }
        </Grid>
}

const Conditions = ({
    isReadOnly, conditions, handleUpdateCondition, handleConfirmCondition, handleClickDeleteCondition,
    conditionUnderEditIndex, setConditionUnderEditIndex, isWarningTextOn, warningText, handleRemoveConditionElement
}: ConditionsProps) => {
    let f = conditions[conditionUnderEditIndex]

    const [currentConstant, setCurrentConstant] = useState<number>()
    const handleAddElement = (e: React.MouseEvent) => {
        const element = elementFromEvent(e, currentConstant)
        handleUpdateCondition(conditionUnderEditIndex, element, f.displayName)
    }
    const [disabled, setDisabled] = useState<boolean>(false)

    const displayCondition = useMemo<JSX.Element[]>(() => {
        if (!f || !f.elements.length) {
            return [<Typography variant='body1' color={ '#CCCCCC' } >Condition beep boop bop</Typography>]
        }

        let elements = f.elements

        return (
            elements.map((e, i) => {
                let value: string = conditionElementToStr(e)
                // if current element is a X OP Y operator and X is SelfBodyState or
                // OpponentBodyState -> set drop down list

                if (i == elements.length - 1 && isPerceptibleBodyState(elements[i-1]) && isOperatorWithDoubleOperands(elements[i])) {
                    // disable all other button
                    setDisabled((_) => true)

                    return (
                        <div style={{ display: 'flex' }}>
                            <Typography style={{marginRight: '4px'}} key={`${e.type}-${e.value}-${i}`} variant='body1'>
                                {/* <span key={`${e.type}-${e.value}-${i}`}>{value} </span> */}
                                {value}
                            </Typography>
                            <Autocomplete
                                disablePortal
                                key={`autocomplete-perceptible-${e.value}-${i}`}
                                options={BodyStates}
                                getOptionLabel={(option: BodyStateOption) => option.name}
                                groupBy={(option: BodyStateOption) => option.group}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        style: {
                                            height: '10px',
                                            width: 150,
                                            alignContent: 'space-around',
                                        },
                                    }}
                                    />
                                )}
                                // on change, update with the selected value and remove disabled
                                onChange={(_, bs: BodyStateOption) => {
                                    setDisabled(false)
                                    handleUpdateCondition(conditionUnderEditIndex, {value: bs.bodystate, type: ElementType.BodyState}, f.displayName)
                                }}
                            />
                        </div>
                    )
                } else {
                    setDisabled(false)
                }
                return (
                    <Typography style={{marginRight: '0px'}} key={`${e.type}-${e.value}-${i}`} variant='body1'>
                        {/* <span key={`${e.type}-${e.value}-${i}`}>{value} </span> */}
                        {value}
                    </Typography>
                )
            })
    )}, [f])

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

                <Grid xs={ 12 } item sx={{mt: 1}}>
                    <TextField
                      label="Give it a name"
                      size="small"
                      fullWidth
                      value={f.displayName || ""}
                      onChange={(e) => handleUpdateCondition(conditionUnderEditIndex, undefined, e.target.value)}
                    />
                </Grid>

                <Grid xs={ 10 } item className='function-creator'>
                    <Box
                        sx={{
                                // border: 1,
                                backgroundColor: "white",
                                borderColor: "grey.500",
                                borderRadius: 2,
                                p: '10px'
                            }}
                    >
                        { displayCondition }
                    </Box>
                </Grid>

                { !isReadOnly &&
                    <Grid style={{ flexGrow: 1, display: 'flex', maxWidth: 'none' }} xs={ 2 } item className='delete-interface'>
                        <IconButton
                            sx={{ alignItems: 'flex-end'}}
                            onClick={(_) => {handleRemoveConditionElement(conditionUnderEditIndex)}}
                        >
                            <BackspaceIcon/>
                        </IconButton>
                    </Grid> }


                {isWarningTextOn &&
                    <Grid item xs={12}>
                    <Typography color={'red'} variant='overline'>{warningText}</Typography>
                    </Grid>
                }

                {
                    isReadOnly ? <></> : (
                        <>

                            <Grid xs={ 12 } item sx={{border:'1px solid #BBBBBB', borderRadius:'10px', marginTop:'1rem', p:'0.5rem', pb:'1rem'}}>
                                <Typography variant='overline'>{ conditionElementTitles[0].id }</Typography>
                                <Box sx={ {display: "flex", flexWrap: 'wrap', gap: 0.5, pr:2} }>
                                    {
                                        operators.map((o) => {
                                            let color = operatorColor(o)
                                            return (
                                                <Chip
                                                    key={ `operator-${o}` }
                                                    id={ `operator.${o}` }
                                                    onClick={ handleAddElement }
                                                    variant='outlined'
                                                    size='small'
                                                    label={o}
                                                    sx={{
                                                        backgroundColor: color + '55',
                                                        "&&:hover": {backgroundColor: color, borderColor:'#333333'},
                                                        // box-sizing: border-box',
                                                        // -moz-box-sizing: 'border-box',
                                                        // -webkit-box-sizing: border-box;
                                                    }}
                                                    className={'operator-chip'}
                                                    disabled={isReadOnly || disabled}
                                                />
                                            )
                                        })
                                    }
                                </Box>
                            </Grid>

                            <Grid xs={ 5.85 } item sx={{border:'1px solid #BBBBBB', borderRadius:'10px', marginTop:'1rem', marginRight:'0.5rem', p:'0.5rem', pb:'1rem'}}>
                                <Typography variant='overline' sx={{m:0}}>{ conditionElementTitles[1].id }</Typography>
                                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                    <TextField
                                        color={ "info" }
                                        type="number"
                                        size="small"
                                        defaultValue={currentConstant}
                                        onChange={(e) => setCurrentConstant(parseInt(e.target.value))}
                                        sx={{flex: 1}}
                                        disabled={isReadOnly}
                                    />
                                    <Button
                                        id='constant'
                                        variant="outlined"
                                        onClick={handleAddElement}
                                        disabled={isReadOnly || disabled}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Grid>

                            <Grid xs={ 5.85 } item sx={{border:'1px solid #BBBBBB', borderRadius:'10px', marginTop:'1rem', p:'0.5rem', pb:'1rem'}}>
                                <Typography variant='overline'>{ conditionElementTitles[2].id }</Typography>
                                <Box
                                    id='perceptible'
                                    sx={{ flexGrow: 1, display: 'flex', maxWidth: 'none', alignItems: 'center' }}
                                >
                                    <PerceptibleList
                                        disabled={isReadOnly || disabled}
                                        perceptibles={perceptibles}
                                        conditionUnderEditIndex={conditionUnderEditIndex}
                                        handleUpdateCondition={handleUpdateCondition}
                                    />
                                </Box>
                            </Grid>
                        </>
                    )
                }



                {
                    isReadOnly ? <></> : (
                        <>
                            <Grid item>
                                <Button
                                    id={`confirm-gp-function`}
                                    variant="outlined"
                                    size="large"
                                    // className={ styles.confirm }
                                    onClick={() => handleConfirmCondition()}
                                >
                                    Confirm
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
