import React, { useState } from 'react';
import { Box, Button, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MentalState } from '../types/MentalState';
import { Character, CHARACTERS_ACTIONS, ACTIONS_ICON_MAP } from '../constants/constants';

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
            handleSetMentalStateAction(current_menu, CHARACTERS_ACTIONS[character_index][e.target.id.split('-')[1]])
        }
        setAnchorEl(null)
    }

    let character_index = Object.keys(Character).indexOf(character)
    let actions = Object.keys(CHARACTERS_ACTIONS[character_index]).filter((a) => isNaN(parseInt(a)))

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
                                action {CHARACTERS_ACTIONS[character_index][state.action]}
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
            <Grid
            item
            xs={12}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "left",
                alignItems: "left",
                mt: "2rem",
            }}>
                <Box
                style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "0rem 0 2rem 0",
                    justifyContent: "center",
                }}
                >
                    {actions.map((key, key_i) => {
                        if (key !== 'COMBO'){
                            return (
                                <Tooltip title={`${key}`}>
                                    <div
                                        key={`iconized-instruction-${key_i}`}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            textAlign: "center",
                                            width: "2.5rem",
                                            marginRight: "0.3rem",
                                            padding: "0.3rem",
                                            border: "1px solid #CCCCCC",
                                            borderRadius: "0.8rem",
                                            transitionDuration: "50ms",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <i
                                            className="material-icons"
                                            style={{ fontSize: "1rem" }}
                                        >
                                            {ACTIONS_ICON_MAP[key]}
                                        </i>
                                        <p style={{ marginTop: "0.1rem", marginBottom: "0" }}>
                                            {CHARACTERS_ACTIONS[character_index][key]}
                                        </p>
                                    </div>
                                </Tooltip>
                            );
                        }
                    })}
                </Box>
            </Grid>
        </Grid>
    )
}

export default MentalStates;