import React, { useState, KeyboardEventHandler } from 'react';
import { Box, Button, Card, Grid, Typography } from "@mui/material";
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


const buttonStyle = { marginBottom:"0.5rem", marginTop:"0.5rem", marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem"};
let mentalState = "";
let currentMenu = 0
let combosIndex = 0
const characters: string[] = Object.keys(Character);

const comboToStr = (combo: number[], characterIndex) => {
    let str = ""
    combo.forEach((action) => {
        let a = CHARACTERS_ACTIONS[characterIndex][action].replace('_', ' ')
        str += a + ' '
    })
    return str
}

const actionToStr = (action: number, characterIndex) => {
    if (action < 100) {
        return CHARACTERS_ACTIONS[characterIndex][action]?.replace('_', ' ')
    }
    return `Combo ${action - 101}`
}

const MentalStates = ({
    mentalStates, combos, handleValidateCombo, character, setCharacter, handleAddMentalState, handleClickRemoveMentalState, 
    handleSetMentalStateAction, handleClickTreeEditor
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedNewAction, setSelectedNewAction] = useState<boolean>(false);
    const [combo, setCombo] = useState<number[]>([])

    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        let id = event.currentTarget.id.split('-')
        let menuIndex = parseInt(id[id.length - 1])
        currentMenu = menuIndex
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (e) => {
        if (e.target.id) {
            let a = e.target.id.split('-')[1]
            if (!a.includes('COMBO')) {
                handleSetMentalStateAction(currentMenu, CHARACTERS_ACTIONS[characterIndex][a])
            } else {
                let comboNumber = parseInt(a.split('_')[1])
                handleSetMentalStateAction(currentMenu, 101 + comboNumber)
            }
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

    let characterIndex = Object.keys(Character).indexOf(character)
    let actions = Object.keys(CHARACTERS_ACTIONS[characterIndex]).filter((a) => isNaN(parseInt(a)))
    combos.forEach((_, i) => {
        actions.push(`COMBO_${i}`)
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
                            console.log(key)
                            if (!key.includes('COMBO')){
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
                                                {CHARACTERS_ACTIONS[characterIndex][key]}
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
                                characterIndex={characterIndex}
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
                            characterIndex={characterIndex}
                        />
                        <ValidateCombo onValidateCombo={() => { 
                            handleValidateCombo(combo, combosIndex)
                            combosIndex += 1
                            setCombo([])
                        }} />
                    </div>
                    <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        padding: '0.5rem',
                    }}
                    >
                        {
                            combos.map((combo, key) => {
                                return (
                                    <Tooltip key={`combos-tooltip-${key}`} title={comboToStr(combo, characterIndex)}>
                                        <Card 
                                            sx=
                                            {{
                                                marginLeft: '1.5rem',
                                                padding: '0.2rem',
                                                height: '1.5rem',
                                                width: '4rem',
                                                fontSize: '12px',
                                                textAlign: 'center',
                                                border: '1px solid black',
                                                ':hover': {
                                                    bgcolor: '#CCCCCC',
                                                    cursor: 'pointer'
                                                }
                                            }} 
                                            key={`combo-${key}`}
                                            onClick={() => {
                                                combosIndex = key
                                                setCombo(combos[combosIndex])
                                            }}
                                            >  
                                                Combo {key}
                                        </Card>
                                    </Tooltip>
                                )
                            })
                        }
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default MentalStates;