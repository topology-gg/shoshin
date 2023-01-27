import React, { useState, KeyboardEventHandler } from "react";
import { Box, Card, Typography } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import SingleAction  from './SingleAction'
import NewAction  from './NewAction'
import ValidateCombo from './ValidateCombo';
import { Character, CHARACTERS_ACTIONS, ACTIONS_ICON_MAP, MAX_COMBO_SIZE } from '../constants/constants';

const comboToStr = (combo: number[], characterIndex) => {
    let str = ""
    combo.forEach((action) => {
        let a = CHARACTERS_ACTIONS[characterIndex][action].replace('_', ' ')
        str += a + ' '
    })
    return str
}
let combosIndex = 0

const Combos = ({
    character, combos, handleValidateCombo
}) => {
    const [selectedNewAction, setSelectedNewAction] = useState<boolean>(false);
    const [combo, setCombo] = useState<number[]>([])

    let characterIndex = Object.keys(Character).indexOf(character)
    let actions = Object.keys(CHARACTERS_ACTIONS[characterIndex]).filter((a) => isNaN(parseInt(a)))

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

    return <Box
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
            </Box>
}

export default Combos;