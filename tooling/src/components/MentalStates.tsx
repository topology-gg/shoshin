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
let current_menu = 0
const characters: string[] = Object.keys(Character);

const MentalStates = ({
    mentalStates, character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, 
    handleSetMentalStateAction, handleClickTreeEditor
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        let id = event.currentTarget.id.split('-')
        let menu_index = parseInt(id[id.length - 1])
        current_menu = menu_index
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (e) => {
        if (e.target.id) {
            handleSetMentalStateAction(current_menu, charactersActions[character_index][e.target.id.split('-')[1]])
        }
        setAnchorEl(null)
    }

    let character_index = Object.keys(Character).indexOf(character)
    let actions = Object.keys(charactersActions[character_index]).filter((a) => isNaN(parseInt(a)))

    return (
        <Grid 
        container
        sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "left",
            mt: "1rem",
        }}
        >
            <Grid item xs={12}>
                <Box>
                    <Button sx={{ ml: '2rem', border: 1, mb: '5px' }} onClick={() => setCharacter(characters[(character_index + 1)%characters.length])}>
                        Selected character: {character}
                    </Button>
                </Box>
            </Grid>
            <Grid 
            xs={2} 
            item
            sx={{
                display:"flex",
                alignItems:"flex-end",
                justifyContent:"space-around"
            }} 
            >
                <IconButton onClick={(_)=>{mentalState ? handleAddMentalState(mentalState) : 0}}><AddIcon/></IconButton>
            </Grid>
            <Grid xs={10} item>
                <TextField color={"info"} fullWidth id="standard-basic" label="Input Mental State" variant="standard" onChange={(event) => {mentalState = event.target.value}}/>
            </Grid>
            <Grid
            item
            xs={12}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "left",
                alignItems: "left",
                mt: "1rem",
            }}>
                {
                    mentalStates.map((state: MentalState, i: number) => { 
                        return <Box
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
                                id={`actions-button-${i}`}
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup='true'
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                action {charactersActions[character_index][state.action]}
                            </Button>
                            <Menu
                                id={`actions-menu-${i}`}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                {
                                    actions.map((action) => {
                                        return <MenuItem id={ `action-${action}-${i}` } key={ `action-${action}-${i}` } onClick={handleClose}>{action}</MenuItem> 
                                    })
                                }
                            </Menu>
                        </Box>
                    })
                }
            </Grid>
        </Grid>
    )
}

export default MentalStates;