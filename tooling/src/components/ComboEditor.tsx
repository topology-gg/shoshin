import React, { useState, KeyboardEventHandler } from "react";
import { Box, Button, Typography } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import SingleAction  from './SingleAction'
import NewAction  from './NewAction'
import { CHARACTERS_ACTIONS, ACTIONS_ICON_MAP, MAX_COMBO_SIZE } from '../constants/constants';

const ComboEditor = ({
    editingCombo, setEditingCombo, characterIndex, selectedIndex, setSelectedIndex, handleValidateCombo,
    displayButton
}) => {
    const [selectedNewAction, setSelectedNewAction] = useState<boolean>(false);

    let actions = Object.keys(CHARACTERS_ACTIONS[characterIndex]).filter((a) => isNaN(parseInt(a)))

    const handleInsertInstruction = (action) => {
        if (editingCombo.length > MAX_COMBO_SIZE) {
            return;
        } else {
            setEditingCombo((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev))
                prev_copy.push(action)
                return prev_copy
            })
        }
    };
    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (event.code === "Backspace") {
            // Backspace - Remove last instruction
            setEditingCombo((prev) => {
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
                <Typography variant='overline'>Combo Actions</Typography>
                <Box>
                    <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        margin: "0rem 0 2rem 0",
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
                            margin: '0 0 0.5rem 0',
                            position: 'relative',
                            display: 'flex',
                        }}
                    >    
                        
                        {editingCombo.map((action, index) => (
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
                        {
                            displayButton && 
                            <Button variant="outlined" onClick={() => { 
                                handleValidateCombo(editingCombo, selectedIndex)
                                setEditingCombo([])
                                setSelectedIndex(null)
                            }}>Confirm</Button>
                        }
                    </div>
                </Box>
            </Box>
}

export default ComboEditor;