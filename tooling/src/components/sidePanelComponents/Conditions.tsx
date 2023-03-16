import React, { useMemo, useState } from 'react';
import { Box, Button, Chip, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Autocomplete } from "@mui/material";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import TextField from '@mui/material/TextField';
import { ConditionElement, Operator, ElementType, Perceptible, Condition, isPerceptibleBodyState, isOperatorWithDoubleOperands, conditionElementToStr } from '../../types/Condition'
import PerceptibleList from './PerceptibleList'
import { ChevronRight } from '@mui/icons-material';
import { BodystatesAntoc, BodystatesJessica } from '../../types/Condition';

// Interfaces

interface ConditionsProps {
    conditions: Condition[]
    handleUpdateCondition: (index: number, element: ConditionElement) => void
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

const gridItemStyle = {
    border: 1,
    borderColor: "grey.500",
    borderRadius: 2,
    p: '5px',
}

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

    const text = !index ? 'No conditions made' : `${isReadOnly ? 'Viewing' : 'Editing'} Condition ${index}`

    return <Grid sx={{ mt: '1rem' }} xs={ 12 } item className='warning-test'>
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
        handleUpdateCondition(conditionUnderEditIndex, element)
    }
    const [disabled, setDisabled] = useState<boolean>(false)
    const displayCondition = useMemo<JSX.Element[]>(() => {
        if (!f || !f.elements.length) {
            return [<Typography variant='caption' color={ '#CCCCCC' } >Let's start making Conditions!</Typography>]
        }
        let elements = f.elements
        return (
            elements.map((e, i) => {
                let value = conditionElementToStr(e)
                // if current element is a X OP Y operator and X is SelfBodyState or
                // OpponentBodyState -> set drop down list
                if (i == elements.length - 1 && isPerceptibleBodyState(elements[i-1]) && isOperatorWithDoubleOperands(elements[i])) {
                    // disable all other button
                    setDisabled((_) => true)
                    return (
                        <div style={{ display: 'flex' }}>
                            <Typography style={{marginRight: '4px'}} key={`${e.type}-${e.value}-${i}`} variant='caption'>
                                <span key={`${e.type}-${e.value}-${i}`}>{value} </span>
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
                                    handleUpdateCondition(conditionUnderEditIndex, {value: bs.bodystate, type: ElementType.BodyState})
                                }}
                            />
                        </div>
                    )
                } else {
                    setDisabled(false)
                }
                return <Typography style={{marginRight: '4px'}} key={`${e.type}-${e.value}-${i}`} variant='caption'>
                    <span key={`${e.type}-${e.value}-${i}`}>{value} </span>
                </Typography>
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
            pl: '2rem',
            pr: '1rem',
        }}>
            <Typography sx={{ fontSize: '17px' }} variant='overline'>Conditions</Typography>
            <Grid container spacing={1}>
                <Grid
                    xs={ 12 }
                    item
                    className='available-conditions'
                    sx={{mb:2}}
                >
                    <List dense sx={{ flex: 1 }}>
                        {
                            conditions.slice(0, conditions.length - 1).map((_, i) => {
                                return (
                                    <ListItem
                                        disablePadding
                                        id={`condition-${i}`}
                                        key={`condition-${i}`}
                                        secondaryAction={
                                            <IconButton
                                                edge="end" aria-label="delete" onClick={() => handleClickDeleteCondition(i)}
                                                disabled={isReadOnly}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemButton
                                            onClick={() => setConditionUnderEditIndex(i)}
                                            selected={i === conditionUnderEditIndex}
                                        >
                                            {i === conditionUnderEditIndex && <ListItemIcon><ChevronRight /></ListItemIcon>}
                                            <ListItemText inset={i !== conditionUnderEditIndex} primary={`Condition ${i}`} />
                                        </ListItemButton>

                                    </ListItem>
                                )
                            })
                        }

                        {
                            !isReadOnly ? (
                                <ListItem
                                    disablePadding
                                >
                                    <ListItemButton
                                        onClick={() => setConditionUnderEditIndex(conditions.length - 1)}
                                        selected={conditions.length - 1 === conditionUnderEditIndex}
                                    >
                                        {conditions.length - 1 === conditionUnderEditIndex && <ListItemIcon><ChevronRight /></ListItemIcon>}
                                        <ListItemText inset={conditions.length - 1 !== conditionUnderEditIndex} primary="New Condition" />
                                    </ListItemButton>
                                </ListItem>
                            ) : <></>
                        }

                    </List>
                </Grid>

                {
                    isReadOnly ? <></> : (
                        <Grid container spacing={1} sx={{pt:0, pl:1, pr:1, pb:1.5, border:'1px solid #999999', borderRadius:'10px'}}>
                            <Grid item className='functions-title' xs={ 12 }>
                                <Grid container spacing={1}>
                                    {
                                        conditionElementTitles.map((f) => {
                                            let style =  f.id == 'Const' ? { maxWidth: 'none', flexGrow: 1 } : {}
                                            return <Grid
                                                key={ `function-${f.id}` }
                                                style={ style }
                                                sx={{ p: '5px' }}
                                                item
                                                xs={ f.width }>
                                                    <Typography variant='overline'>{ f.id }</Typography>
                                                </Grid>
                                        })
                                    }
                                </Grid>
                            </Grid>

                            <Grid xs={ conditionElementTitles[0].width } item>
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

                            <Grid xs={ conditionElementTitles[1].width } item>
                                <Box>
                                    <TextField
                                        color={ "info" }
                                        type="number"
                                        defaultValue={currentConstant}
                                        onChange={(e) => setCurrentConstant(parseInt(e.target.value))}
                                        style={{width:'4rem'}}
                                        disabled={isReadOnly}
                                    />
                                    <Button
                                        id='constant'
                                        variant="outlined"
                                        onClick={handleAddElement}
                                        sx={{marginTop:'0.5rem'}}
                                        disabled={isReadOnly || disabled}
                                    >
                                            Add
                                    </Button>
                                </Box>
                            </Grid>

                            <Grid xs={ conditionElementTitles[2].width } item>
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
                        </Grid>
                    )
                }

                { handleDisplayText(isReadOnly, isWarningTextOn, warningText, conditionUnderEditIndex) }

                <Grid xs={ 9 } item className='function-creator'>
                    <Box
                        sx={{ ...gridItemStyle }}
                    >
                        { displayCondition }
                    </Box>
                </Grid>

                {
                    isReadOnly ? <></> : (
                        <>
                            <Grid style={{ flexGrow: 1, display: 'flex', maxWidth: 'none' }} xs={ 2 } item className='delete-interface'>
                                <IconButton
                                    sx={{ mt: '1rem', alignItems: 'flex-end'}}
                                    onClick={(_) => {handleRemoveConditionElement(conditionUnderEditIndex)}}
                                >
                                    <BackspaceIcon/>
                                </IconButton>
                            </Grid>

                            <Grid item>
                                <Button
                                    id={`confirm-gp-function`}
                                    variant="outlined"
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
