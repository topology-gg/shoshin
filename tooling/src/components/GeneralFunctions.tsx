import React from 'react';
import styles from '../../styles/Home.module.css'
import { Box, Grid } from "@mui/material";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { FunctionElement, Operator, Function, ElementType, Perceptible } from '../types/Function'
import BasicMenu from './Menu'

const cardStyle = {
    display: 'flex', 
    alignItems: 'center', 
    maxHeight: '2rem', 
    p: '1px', 
    m: '1px', 
    justifyContent: 'space-around',
    border: 1,
}

const gridItemStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    border: 1,
    borderRadius: 4,
    boxShadow: 3,
    p: '5px',
    m: '1px',
}

const functions_title = [
    { id: 'Operators', width: 5 }, 
    { id: 'Const', width: 1 }, 
    { id: 'Perceptibles', width: 5 }
]
const operators = Object.values(Operator)
const perceptibles = Object.keys(Perceptible).filter(x => isNaN(parseInt(x)))

const handleDrag = (e) => {
    document.body.style.cursor = 'grabbing';
    let source = e.target.id.split('-')
    switch (source[0]) {
        case 'operator': {
            currentDraggedItem = { value: source[1], type: ElementType.Operator} as FunctionElement
            break;
        }
        case 'constant': {
            currentDraggedItem = { value: currentConstant, type: ElementType.Constant} as FunctionElement
            break;
        }
        case 'perceptible': {
            currentDraggedItem = { value: source[1], type: ElementType.Perceptible} as FunctionElement
            break;
        }
    }
    e.preventDefault()
    e.stopPropagation()
}
const handleDragEnd = (e) => {
    document.body.style.cursor = 'default';
    currentDraggedItem = {}
    e.preventDefault()
    e.stopPropagation()
}
const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
}

const handleFunctionDisplay = (f: Function) => {
    if (!f) {
        return {color: '#CCCCCC'}
    }
    return {color: 'black'}
}

const handleDisplayWarningText = (isWarningTextOn) => {
    return isWarningTextOn && 
        <Grid sx={{color: 'red', border: 'none', boxShadow: 'none', mt: '1rem' }} xs={ 12 } item className='warning-test'>
            <Typography variant='overline'>Invalid {currentDraggedItem.type}, please try again</Typography>
        </Grid>
}

const functionToString = (f: Function) => {
    if (!f) {
        return 'Drop your operators, constants and perceptibles here'
    }
    let str = ' '
    f.elements.map((e) => {
        let value = e.type === ElementType.Perceptible ? Perceptible[e.value] : e.value
        str += value + ' '
    })
    return str
}

let currentDraggedItem = {} as FunctionElement
let currentConstant = 0

const GeneralFunctions = ({ 
    functions, handleUpdateGeneralFunction, handleConfirmFunction, functionsIndex, 
    setFunctionsIndex, isWarningTextOn
}) => {
    let f = functions[functionsIndex]
    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            mt: "2rem",
        }}>
            <Grid container spacing={0} sx={{ display: 'flex', justifyContent: "space-between" }}>
                <Grid sx={{ m: '3px' }} item className='functions-title' xs={ 12 }>
                    <Grid container sx={{ display: 'flex', justifyContent: "space-between" }}>
                        {
                            functions_title.map((f) => {
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
                <Grid sx={ gridItemStyle } xs={ 5 } item>
                    {
                        operators.map((o) => {
                            return <Card 
                                        key={ `operator-${o}` } 
                                        id={  `operator-${o}` }
                                        onDragEnd={ (e) => handleDragEnd(e) } 
                                        onDrag={ (e) => handleDrag(e) } 
                                        draggable 
                                        sx={ cardStyle }>
                                            <CardContent sx={{padding: '5px!important'}}>{o}</CardContent>
                                    </Card>
                        })
                    }
                </Grid>
                <Grid style={{ maxWidth: 'none', flexGrow: 1 }} sx={ { ...gridItemStyle }} xs={ 1 } item>
                    <Box
                        id='constant'
                        draggable
                        onDragEnd={ (e) => handleDragEnd(e) } 
                        onDrag={ (e) => handleDrag(e) } 
                    >
                        <TextField 
                            color={ "info" } 
                            type="number" 
                            defaultValue={currentConstant}
                            onChange={(e) => currentConstant=parseInt(e.target.value)}
                        />
                    </Box>
                </Grid>
                <Grid sx={ gridItemStyle } xs={ 5 } item>
                    <Box
                        id='perceptible'
                        sx={{ flexGrow: 1, display: 'flex', maxWidth: 'none', alignItems: 'center' }}
                        onDragEnd={ (e) => handleDragEnd(e) } 
                        onDrag={ (e) => handleDrag(e) } 
                    >
                        <BasicMenu perceptibles={perceptibles} functionsIndex={functionsIndex} handleUpdateGeneralFunction={handleUpdateGeneralFunction}></BasicMenu>
                    </Box>
                </Grid>
                { handleDisplayWarningText(isWarningTextOn) }
                <Grid sx={{ ...gridItemStyle, mt: !isWarningTextOn && '1rem' }} xs={ 12 } item className='function-creator'>
                    <Card 
                        style={{ border: 'none', boxShadow: 'none', flexGrow: 1 }} 
                        onDragOver={ (e) => handleDragOver(e) }
                        onDrop={(e) => {
                            handleUpdateGeneralFunction(functionsIndex, currentDraggedItem)
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                    >
                        <Typography 
                            variant='caption' 
                            textAlign={'justify'}
                            color={ handleFunctionDisplay(f) }
                        >
                            { functionToString(f) }
                        </Typography>
                    </Card>
                </Grid>
                <button 
                    className={ styles.confirm }
                    onClick={() => handleConfirmFunction()}
                >
                    Confirm
                </button>
                <Grid 
                    sx={{ ...gridItemStyle, border: 'none', boxShadow: 'none', mt: '2rem' }} 
                    xs={ 12 } 
                    item 
                    className='available-functions'
                >
                    <Box>Function area</Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default GeneralFunctions;