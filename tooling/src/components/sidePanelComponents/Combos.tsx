import React, { useState } from "react";
import { Box, ListItem, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import { Character, CHARACTERS_ACTIONS, MAX_COMBO_SIZE } from '../../constants/constants';
import { ChevronRight } from "@mui/icons-material";
import ComboEditor from "./ComboEditor";

const comboToStr = (combo: number[], characterIndex) => {
    let str = ""
    combo.forEach((action) => {
        let a = CHARACTERS_ACTIONS[characterIndex][action].replace('_', ' ')
        str += a + ' '
    })
    return str
}

const Combos = ({
    isReadOnly, character, combos, handleValidateCombo
}) => {
    const [editingCombo, setEditingCombo] = useState<number[]>([])
    // If the selectedIndex is null, it means the "New Combo" is selected
    const [selectedIndex, setSelectedIndex] = useState<number>(null)

    let characterIndex = Object.keys(Character).indexOf(character)

    return <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "left",
                    alignItems: "left",
                    pt: "1rem",
                    pl: "2rem",
                }}
            >
                <Typography sx={{ fontSize: '17px' }} variant='overline'>Combos</Typography>
                <List dense>
                    {
                        combos.map((combo, index) => {
                            return (
                                <ListItem
                                    disablePadding
                                    key={`combo-${index}`}
                                >
                                    <ListItemButton
                                        selected={selectedIndex === index}
                                        onClick={
                                            () => {
                                                setEditingCombo(combo)
                                                setSelectedIndex(index)
                                            }
                                        }
                                    >
                                        {selectedIndex === index &&
                                            <ListItemIcon>
                                                <ChevronRight />
                                            </ListItemIcon>
                                        }
                                        <ListItemText inset={selectedIndex !== index}>
                                            Combo {index}
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            )
                        })
                    }

                    {
                        !isReadOnly ? (
                            <ListItem
                                disablePadding
                            >
                                <ListItemButton
                                    selected={selectedIndex === null}
                                    onClick={() => {
                                        setEditingCombo([])
                                        setSelectedIndex(null)
                                    }}
                                >
                                    {selectedIndex === null &&
                                        <ListItemIcon>
                                            <ChevronRight />
                                        </ListItemIcon>
                                    }
                                    <ListItemText inset={selectedIndex !== null}>
                                        New Combo
                                    </ListItemText>

                                </ListItemButton>
                            </ListItem>
                        ) : <></>
                    }

                </List>
                <ComboEditor
                    isReadOnly={isReadOnly}
                    editingCombo={editingCombo}
                    setEditingCombo={setEditingCombo}
                    characterIndex={characterIndex}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    handleValidateCombo={handleValidateCombo}
                    displayButton={true}
                ></ComboEditor>
            </Box>
}

export default Combos;