import React, { useState, KeyboardEventHandler } from 'react';
import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SingleAction  from './SingleAction'
import NewAction  from './NewAction'
import ValidateCombo from './ValidateCombo';
import { MentalState } from '../types/MentalState';
import { Character, CHARACTERS_ACTIONS, ACTIONS_ICON_MAP, MAX_COMBO_SIZE } from '../constants/constants';


const button_style = { marginBottom:"0.5rem", marginTop:"0.5rem", marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem"};
let mentalState = "";
let current_menu = 0
const characters: string[] = Object.keys(Character);

const MentalStates = ({
    mentalStates, character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, 
    handleSetMentalStateAction, handleClickTreeEditor
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedNewAction, setSelectedNewAction] = useState<boolean>(false);
    const [combo, setCombo] = useState<number[]>([0, 1, 1])

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
    const handleInsertInstruction = (action) => {
        if (combo.length > MAX_COMBO_SIZE) {
            return;
        } else {
            setCombo((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev))
                prev_copy.push(action)
                return prev_copy
            })
        }
    };
    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (event.code === "Backspace") {
            // Backspace - Remove last instruction
            setCombo((prev) => {
                const new_program = prev.slice(0, -1);
                return new_program
            })
        }     
    };

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
                <Typography sx={{ ml: '1rem', fontSize: '17px' }} variant='overline'>Combos</Typography>
                <Box
                style={{
                    border: '1px solid',
                    borderRadius: '45px'
                }}
                >
                    <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        margin: "0rem 0 2rem 0",
                        padding: '0.5rem',
                        justifyContent: "center",
                    }}
                    >
                        {actions.map((key, key_i) => {
                            if (key !== 'COMBO'){
                                return (
                                    <Tooltip key={`${key}`} title={`${key.replaceAll('_', ' ')}`}>
                                        <div
                                            key={`iconized-action-${key_i}`}
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
                    <div
                        style={{
                            height: "25px",
                            margin: '0 0 0.5rem 2rem',
                            position: 'relative',
                            display: 'flex',
                        }}
                    >    
                        <Typography sx={{mr: '1rem'}} variant='overline'>Build combo</Typography>
                        {combo.map((action, index) => (
                            <SingleAction
                                key={`action-${index}`}
                                action={action}
                                characterIndex={character_index}
                            />
                        ))}
                        <NewAction
                            onInsert={handleInsertInstruction}
                            onKeyDown={handleKeyDown}
                            onSelect={() => {
                                setSelectedNewAction(true)
                            }}
                            onBlur={() => {
                                setSelectedNewAction(false)
                            }}
                            selected={selectedNewAction}
                            characterIndex={character_index}
                        />
                        <ValidateCombo onValidateCombo={() => {}} />
                    </div>
                </Box>
            </Grid>
        </Grid>
    )
}

export default MentalStates;