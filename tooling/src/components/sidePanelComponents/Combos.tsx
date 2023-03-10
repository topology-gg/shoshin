import React, { useState } from "react";
import { Box, ListItem, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Character, CHARACTERS_ACTIONS } from '../../constants/constants';
import { ChevronRight } from "@mui/icons-material";
import ComboEditor from "./ComboEditor";

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