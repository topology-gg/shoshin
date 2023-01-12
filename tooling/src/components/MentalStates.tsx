import React, { useState } from 'react';
import { Box, Button, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { charactersActions, Character, MentalState } from '../types/MentalState';

const button_style = { marginBottom:"0.5rem", marginTop:"0.5rem", marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem"};

let mentalState = "";
const characters: string[] = Object.keys(Character);

const MentalStates = ({
    mentalStates, character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, 
    handleClickTreeEditor
}) => {
    let index = Object.keys(Character).indexOf(character)
    let actions = Object.keys(charactersActions[index]).filter((a) => isNaN(parseInt(a)))

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (event, i: number) => {
        if (event.target.id) {
            mentalStates[i].action = charactersActions[index][event.target.id.split('-')[1]]
        }
        setAnchorEl(null)
    }

    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            mt: "1rem",
        }}>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Box>
                        <Button sx={{ ml: '2rem', border: 1, mb: '5px' }} onClick={() => setCharacter(characters[(index + 1)%characters.length])}>
                            Selected character: {character}
                        </Button>
                    </Box>
                </Grid>
                <Grid sx={{
                    display:"flex",
                    alignItems:"flex-end",
                    justifyContent:"space-around"
                    }} xs={2} item>
                    <IconButton onClick={(_)=>{
                        if (mentalState){
                            handleAddMentalState(mentalState);
                        }
                    }}><AddIcon/></IconButton>
                </Grid>
                <Grid xs={10} item>
                    <TextField color={"info"} fullWidth id="standard-basic" label="Input Mental State" variant="standard" onChange={(event) => {mentalState = event.target.value}}/>
                </Grid>
            </Grid>
            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "left",
                alignItems: "left",
                mt: "1rem",
            }}
            >
                {
                    mentalStates.map((state: MentalState, i: number) => (
                        <Box
                        key={`button-wrapper-${i}`}
                        sx={{
                            display:"flex",
                            alignItems:"center",
                            ml: "2rem"
                        }}>
                            <button
                            style={{ ...button_style }}
                            key={`${i}`}
                            onClick={() => handleClickTreeEditor(i+1)}>
                                {`${state.state}`}
                            </button>
                            <IconButton onClick={(_)=>handleClickRemoveMentalState(i)}>
                                <DeleteIcon sx={{fontSize:"small"}}/>
                            </IconButton>
                            <Button
                                id='perceptibles-button'
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup='true'
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                action {charactersActions[index][state.action]}
                            </Button>
                            <Menu
                                id='perceptibles-menu'
                                anchorEl={anchorEl}
                                open={open}
                                onClose={(e) => handleClose(e, i)}
                            >
                                {actions.map((action) => {
                                return <MenuItem id={ `action-${action}` } key={ `action-${action}` } onClick={(e) => handleClose(e, i)}>{action}</MenuItem>
                                })}
                            </Menu>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
}

export default MentalStates;