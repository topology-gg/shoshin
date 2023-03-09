import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MentalState } from '../../types/MentalState';
import { Character, CHARACTERS_ACTIONS } from '../../constants/constants';


const buttonStyle = { marginBottom:"0.5rem", marginTop:"0.5rem", marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem"};
let mentalState = "";
let currentMenu = 0
const characters: string[] = Object.keys(Character);

const actionToStr = (action: number, characterIndex) => {
    if (action < 100) {
        return CHARACTERS_ACTIONS[characterIndex][action]?.replace('_', ' ')
    }
    return `Combo ${action - 101}`
}

const MentalStates = ({
    mentalStates, initialMentalState, handleSetInitialMentalState, combos, character, setCharacter, handleAddMentalState, handleClickRemoveMentalState,
    handleSetMentalStateAction, handleClickTreeEditor
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [anchorElInitialState, setAnchorElInitialState] = useState<null | HTMLElement>(null)

    const open = Boolean(anchorEl)
    const openInitialState = Boolean(anchorElInitialState)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        let id = event.currentTarget.id.split('-')
        let menuIndex = parseInt(id[id.length - 1])
        currentMenu = menuIndex
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (e) => {
        if (e.target.id) {
            let a = e.target.id.split('-')[1]
            if (!a.includes('Combo')) {
                handleSetMentalStateAction(currentMenu, CHARACTERS_ACTIONS[characterIndex][a])
            } else {
                let comboNumber = parseInt(a.split(' ')[1])
                handleSetMentalStateAction(currentMenu, 101 + comboNumber)
            }
        }
        setAnchorEl(null)
    }
    const handleClickInitialState = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElInitialState(event.currentTarget)
    }
    const handleCloseInitialState = (e) => {
        if (e.target.id) {
            let a = e.target.id.split('-')[4]
            handleSetInitialMentalState(parseInt(a))
        }
        setAnchorElInitialState(null)
    }

    let characterIndex = Object.keys(Character).indexOf(character)
    let actions = Object.keys(CHARACTERS_ACTIONS[characterIndex]).filter((a) => isNaN(parseInt(a)))
    combos.forEach((_, i) => {
        actions.push(`Combo ${i}`)
    })

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
                    <Button sx={{ ml: '2rem', border: 1, mb: '5px' }} onClick={() => setCharacter(characters[(characterIndex + 1)%characters.length])}>
                        You are: {character}
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
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "left",
                alignItems: "left",
                mt: "1rem",
                ml: '2rem',
            }}
            xs={10}
            item>
                <Button
                    id={`initial-actions-menu-button`}
                    aria-controls={openInitialState ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={openInitialState ? 'true' : undefined}
                    onClick={handleClickInitialState}
                >
                    <Typography variant='overline'>Starting state: {mentalStates.length > 0 ? mentalStates[initialMentalState].state: 'Create at least one mental state'}</Typography>
                </Button>
                <Menu
                id={'initial-actions-menu'}
                anchorEl={anchorElInitialState}
                open={openInitialState}
                onClose={handleCloseInitialState}
                >
                    {
                        mentalStates.map((ms, i) => {
                            return <MenuItem id={ `initial-mental-state-state-${i}` } key={ `initial-mental-state-state-${i}` } onClick={handleCloseInitialState}>{ms.state}</MenuItem>
                        })
                    }
                </Menu>
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
                            style={{ ...buttonStyle }}
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
                                action {actionToStr(state.action, characterIndex)}
                            </Button>
                            <Menu
                                id={`actions-menu-${i}`}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                {
                                    actions.map((action) => {
                                        return <MenuItem id={ `action-${action}-${i}` } key={ `action-${action}-${i}` } onClick={handleClose}>{action.replaceAll('_', ' ')}</MenuItem>
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