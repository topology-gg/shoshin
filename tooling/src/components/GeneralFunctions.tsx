import React, { useMemo, useState } from 'react';
import { Box, Button, Chip, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Autocomplete } from "@mui/material";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import TextField from '@mui/material/TextField';
import { FunctionElement, Operator, Function, ElementType, Perceptible } from '../types/Function'
import BasicMenu from './Menu'
import { ChevronRight } from '@mui/icons-material';
import { BodystatesAntoc, BodystatesJessica } from '../constants/constants';

interface BodyStateOption {
    group: string
    name: string
    bodystate: number
}

const gridItemStyle = {
    border: 1,
    borderColor: "grey.500",
    borderRadius: 2,
    p: '5px',
}

const BodyStates: BodyStateOption[] = (Object.entries(BodystatesAntoc)
.map(([k, v]) => {
    return {group: 'antoc', name: k, bodystate: v}
})
.filter((v) => !isNaN(parseInt(v.bodystate as string))) as BodyStateOption[])
.concat(
    Object.entries(BodystatesJessica)
    .map(([k, v]) => {
        return {group: 'jessica', name: k, bodystate: v} 
    })
    .filter((v) => !isNaN(parseInt(v.bodystate as string))) as BodyStateOption[]
)

const functionsTitle = [
    { id: 'Operators', width: 5 },
    { id: 'Const', width: 3 },
    { id: 'Perceptibles', width: 4 }
]
const operators = Object.values(Operator)
const perceptibles = Object.keys(Perceptible).filter(x => isNaN(parseInt(x)))

const elementFromEvent = (e): FunctionElement => {
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

const handleDisplayText = (isWarningTextOn, warningText, index) => {
    return <Grid sx={{ mt: '1rem' }} xs={ 12 } item className='warning-test'>
            {
                isWarningTextOn && <Typography color={'red'} variant='overline'>{warningText}</Typography>
                || !isWarningTextOn && <Typography variant='overline'>Editing F{index}</Typography>
            }
        </Grid>
}

const checkPerceptible = (elem: FunctionElement) => {
    let value = elem?.value
    return (
        elem?.type === ElementType.Perceptible &&
        (value == Perceptible.OpponentBodyState || 
        value == Perceptible.SelfBodyState) 
    )
}

const checkOperator = (elem: FunctionElement) => {
    let value = elem?.value
    return (
        elem?.type == ElementType.Operator && 
        value != Operator.OpenAbs && 
        value != Operator.OpenParenthesis && 
        value != Operator.CloseAbs && 
        value != Operator.CloseParenthesis 
        && value != Operator.Not
    )
}

let currentConstant = 0

const GeneralFunctions = ({
    functions, handleUpdateGeneralFunction, handleConfirmFunction, handleClickDeleteFunction,
    functionsIndex, setFunctionsIndex, isWarningTextOn, warningText, handleRemoveElementGeneralFunction 
}) => {
    let f = functions[functionsIndex]

    const handleAddElement = (e) => {
        const element = elementFromEvent(e)
        handleUpdateGeneralFunction(functionsIndex, element)
    }
    const [disabled, setDisabled] = useState<boolean>(false)
    const displayFunction = useMemo<React.ReactElement>(() => {
        if (!f || !f.elements.length) {
            return <Typography variant='caption' color={ '#CCCCCC' } >Drop your operators, constants and perceptibles here</Typography>
        }
        let elements = f.elements
        return (
            f.elements.map((e, i) => {
                let value = e.type === ElementType.Perceptible ? Perceptible[e.value] : e.value
                // convert a close abs to a closed parenthesis
                value = value === '|' ? ')' : value
                // if current element is a X OP Y operator and X is SelfBodyState or 
                // OpponentBodyState -> set drop down list
                if (i == f.elements.length - 1 && checkPerceptible(elements[i-1]) && checkOperator(elements[i])) {
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
                                    handleUpdateGeneralFunction(functionsIndex, {value: bs.bodystate, type: ElementType.Constant})
                                }}
                            />
                        </div>
                    )
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
            mt: "2rem",
        }}>
            <Typography sx={{ fontSize: '17px' }} variant='overline'>Functions</Typography>
            <Grid container spacing={1}>
                <Grid
                    xs={ 12 }
                    item
                    className='available-functions'
                >
                    <List dense sx={{ flex: 1 }}>
                        {
                            functions.slice(0, functions.length - 1).map((_, i) => {
                                return (
                                    <ListItem
                                        disablePadding
                                        id={`function-${i}`}
                                        key={`function-${i}`}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleClickDeleteFunction(i)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemButton
                                            onClick={() => setFunctionsIndex(i)}
                                            selected={i === functionsIndex}
                                        >
                                            {i === functionsIndex && <ListItemIcon><ChevronRight /></ListItemIcon>}
                                            <ListItemText inset={i !== functionsIndex} primary={`F${i}`} />
                                        </ListItemButton>

                                    </ListItem>
                                )
                            })
                        }
                        <ListItem
                            disablePadding
                        >
                            <ListItemButton
                                onClick={() => setFunctionsIndex(functions.length - 1)}
                                selected={functions.length - 1 === functionsIndex}
                            >
                                {functions.length - 1 === functionsIndex && <ListItemIcon><ChevronRight /></ListItemIcon>}
                                <ListItemText inset={functions.length - 1 !== functionsIndex} primary="New Function" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item className='functions-title' xs={ 12 }>
                    <Grid container spacing={1}>
                        {
                            functionsTitle.map((f) => {
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
                <Grid xs={ functionsTitle[0].width } item>
                    <Box sx={ {display: "flex", flexWrap: 'wrap', gap: 0.5} }>
                        {
                            operators.map((o) => {
                                return (
                                    <Chip
                                        key={ `operator-${o}` }
                                        id={ `operator.${o}` }
                                        onClick={ handleAddElement }
                                        disabled={disabled}
                                        variant='outlined'
                                        size='small'
                                        label={o}
                                        sx={{
                                            "&&:hover": {backgroundColor: "#E0B0FF"}
                                        }}
                                    />
                                )
                            })
                        }
                    </Box>
                </Grid>

                <Grid xs={ functionsTitle[1].width } item>
                    <Box>
                        <TextField
                            color={ "info" }
                            type="number"
                            defaultValue={currentConstant}
                            onChange={(e) => currentConstant=parseInt(e.target.value)}
                        />
                        <Button
                            id='constant'
                            variant="outlined"
                            onClick={handleAddElement}
                            disabled={disabled}
                            sx={{marginTop:'0.5rem'}}
                        >
                                Add
                        </Button>
                    </Box>
                </Grid>

                <Grid xs={ functionsTitle[2].width } item>
                    <Box
                        id='perceptible'
                        sx={{ flexGrow: 1, display: 'flex', maxWidth: 'none', alignItems: 'center' }}
                    >
                        <BasicMenu perceptibles={perceptibles} functionsIndex={functionsIndex} handleUpdateGeneralFunction={handleUpdateGeneralFunction} disabled={disabled} ></BasicMenu>
                    </Box>
                </Grid>
                { handleDisplayText(isWarningTextOn, warningText, functionsIndex) }
                <Grid xs={ 9 } item className='function-creator'>
                    <Box
                        sx={{ ...gridItemStyle, display: 'flex' }}
                    >
                        { displayFunction }
                    </Box>
                </Grid>
                <Grid sx={{paddingTop: '0!important'}} xs={ 2 } item className='delete-interface'>
                    <IconButton sx={{marginTop: '0.2rem'}} onClick={(_) => {
                        setDisabled(false)
                        handleRemoveElementGeneralFunction(functionsIndex)
                    }}><BackspaceIcon/></IconButton>
                </Grid>

                <Grid item>
                    <Button
                        id={`confirm-gp-function`}
                        variant="outlined"
                        // className={ styles.confirm }
                        onClick={() => handleConfirmFunction()}
                    >
                        Confirm
                    </Button>
                </Grid>

            </Grid>
        </Box>
    )
}

export default GeneralFunctions;