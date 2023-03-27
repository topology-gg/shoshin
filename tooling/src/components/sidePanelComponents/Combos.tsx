import React, { useState } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { Character } from '../../constants/constants';
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
                    pl: "1rem",
                    pr: "1rem",
                }}
            >
                <Typography sx={{ fontSize: '17px' }} variant='overline'>Combos</Typography>
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <Select
                        value={selectedIndex}
                        size="small"
                        fullWidth
                        onChange={(event) => {
                            const comboIndex: number | null = event.target.value as number
                            setSelectedIndex(comboIndex)
                            setEditingCombo(combos[comboIndex] || [])
                        }}
                    >
                        {combos.map((combo, index) =>
                            <MenuItem value={index}>Combo {index}</MenuItem>
                        )}
                        <MenuItem value={null} disabled={isReadOnly}>New Combo</MenuItem>
                    </Select>

                    {/* <div>
                        <IconButton
                            aria-label="delete" onClick={() => handleClickDeleteCondition(conditionUnderEditIndex)}
                            disabled={isReadOnly || conditionUnderEditIndex === conditions.length - 1 || conditions.length < 3}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div> */}
                </Box>
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
