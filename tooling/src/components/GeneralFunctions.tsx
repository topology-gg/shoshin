import React from 'react';
import styles from '../../styles/Home.module.css'
import { Box, Button, Chip, Grid, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { FunctionElement, Operator, Function, ElementType, Perceptible } from '../types/Function'
import BasicMenu from './Menu'

const gridItemStyle = {
    border: 1,
    borderColor: "grey.500",
    borderRadius: 2,
    p: '5px',
}

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

const functionToDiv = (f: Function) => {
    if (!f || !f.elements.length) {
        return <Typography variant='caption' color={ '#CCCCCC' } >Drop your operators, constants and perceptibles here</Typography> 
    }
    return (
        f.elements.map((e, i) => {
            let value = e.type === ElementType.Perceptible ? Perceptible[e.value] : e.value
            value = value === '|' ? ')' : value
            return <Typography key={`${e.type}-${e.value}-${i}`} variant='caption'>
                <span key={`${e.type}-${e.value}-${i}`}>{value} </span>
            </Typography>
        })
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

    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            mt: "2rem",
        }}>
            <Grid container spacing={1}>
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
                                return <Chip 
                                            key={ `operator-${o}` } 
                                            id={ `operator.${o}` }
                                            onClick={ handleAddElement }
                                            variant='outlined'
                                            size='small'
                                            label={o} />
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
                        <Button id='constant' variant="outlined" onClick={handleAddElement}>Add</Button>
                    </Box>
                </Grid>
                <Grid xs={ functionsTitle[2].width } item>
                    <Box
                        id='perceptible'
                        sx={{ flexGrow: 1, display: 'flex', maxWidth: 'none', alignItems: 'center' }}
                    >
                        <BasicMenu perceptibles={perceptibles} functionsIndex={functionsIndex} handleUpdateGeneralFunction={handleUpdateGeneralFunction}></BasicMenu>
                    </Box>
                </Grid>
                { handleDisplayText(isWarningTextOn, warningText, functionsIndex) }
                <Grid xs={ 9 } item className='function-creator'>
                    <Box 
                        sx={{ ...gridItemStyle }}
                    >
                        { functionToDiv(f) }
                    </Box>
                </Grid>
                <Grid style={{ flexGrow: 1, display: 'flex', maxWidth: 'none' }} xs={ 2 } item className='delete-interface'>
                    <IconButton sx={{ mt: '1rem', alignItems: 'flex-end'}} onClick={(_) => {handleRemoveElementGeneralFunction(functionsIndex)}}><BackspaceIcon/></IconButton>
                </Grid>
                <Grid item>
                    <button 
                        className={ styles.confirm }
                        onClick={() => handleConfirmFunction()}
                    >
                        Confirm
                    </button>
                </Grid>
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
                                        <ListItemButton onClick={() => setFunctionsIndex(i)}>
                                            <ListItemText primary={`F${i}`} />
                                        </ListItemButton>
                                        
                                    </ListItem> 
                                )
                            })
                        }
                    </List>
                </Grid>
            </Grid>
        </Box>
    )
}

export default GeneralFunctions;