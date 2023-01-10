import React from 'react';
import styles from '../../styles/Home.module.css'
import { Box, Grid } from "@mui/material";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { FunctionElement, Operator } from '../types/Function'

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

const handleDrag = (e) => {
    document.body.style.cursor = 'grabbing';
    let source = e.target.id.split('-')
    switch (source[0]) {
        case 'operator': {
            currentDraggedItem = { value: source[1] } as FunctionElement
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

let currentDraggedItem = {} as FunctionElement
let currentConstant = 0

const GeneralFunctions = ({ 
    functions, handleUpdateGeneralFunction, handleConfirmFunction, functionsIndex, setFunctionsIndex
}) => {
    let f = "Drop your operators, constants and perceptibles here"
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
                                return <Grid 
                                    key={ `function-${f.id}` } 
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
                                            <CardContent>{o}</CardContent>
                                    </Card>
                        })
                    }
                </Grid>
                <Grid style={{ maxWidth: 'none', flexGrow: 1 }} sx={ { ...gridItemStyle }} xs={ 1 } item>
                    <TextField 
                        color={ "info" } 
                        id="constant" 
                        type="number" 
                        InputLabelProps={{ shrink: true }}
                        defaultValue={currentConstant}
                        draggable
                        onChange={(e) => currentConstant=parseInt(e.target.value)}
                    />
                </Grid>
                <Grid sx={ gridItemStyle } xs={ 5 } item>
                    Three
                </Grid>
                <Grid sx={{ ...gridItemStyle, mt: '2rem' }} xs={ 12 } item className='function-creator'>
                    <Card 
                        style={{ border: 'none', boxShadow: 'none' }} 
                        onDragOver={ (e) => handleDragOver(e) }
                        onDrop={ (e) => handleUpdateGeneralFunction(e, functionsIndex, currentDraggedItem) }
                    >
                        <Typography variant='caption' color={"#CCCCCC"}>{ f }</Typography>
                    </Card>
                </Grid>
                <button 
                    className={styles.confirm}
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