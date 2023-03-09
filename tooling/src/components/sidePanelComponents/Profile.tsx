import React, { useState } from 'react';
import { Box, Button, FormControl, Grid, Input, InputLabel, OutlinedInput, Select, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MentalState } from '../../types/MentalState';
import { Character, CHARACTERS_ACTIONS } from '../../constants/constants';

const characters: Character[] = Object.values(Character);

const Profile = ({
    agentName,
    setAgentName,
    character,
    setCharacter,
}) => {

    let characterIndex = Object.keys(Character).indexOf(character)

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "left",
                pt: "2rem",
                pl: "2rem",
            }}
        >
            <Typography sx={{ fontSize: '17px' }} variant='overline'>Profile</Typography>

            <Box sx={{fontSize:'14px', mb:'2rem'}}>
                <FormControl variant="standard">
                    <InputLabel htmlFor="component-simple">Agent Name</InputLabel>
                    <Input id="component-simple" value={agentName} onChange={event => setAgentName(event.target.value)}/>
                </FormControl>
            </Box>

            {/* <Box sx={{fontSize:'14px'}}>
                Character type:
                <Button sx={{ ml: '0.5rem', border: 1,}} onClick={() => setCharacter(characters[(characterIndex + 1)%characters.length])}>
                    {character}
                </Button>
            </Box> */}

        <FormControl variant="standard" sx={{ minWidth: 120, width: '5rem', mb:'2rem' }}>
            <InputLabel id="demo-simple-select-standard-label">Character</InputLabel>

            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={character}
                onChange={(event) => setCharacter(event.target.value)}
                label="Character"
            >
                <MenuItem value={Character.Jessica}>Jessica</MenuItem>
                <MenuItem value={Character.Antoc}>Antoc</MenuItem>
            </Select>
        </FormControl>

        </Box>
    )
}

export default Profile;