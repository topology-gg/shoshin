import React from 'react';
import { Box, FormControl, Input, InputLabel, Select, Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { Character } from '../../constants/constants';

const characters: Character[] = Object.values(Character);

const Profile = ({
    isReadOnly,
    agentName,
    setAgentName,
    character,
    setCharacter,
}) => {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "left",
                pt: "1rem",
                pl: "2rem",
            }}
        >
            <Typography sx={{ fontSize: '17px' }} variant='overline'>
                <span style={{marginRight:'8px'}}>&#128220;</span>Profile
            </Typography>

            <Box sx={{fontSize:'14px', mb:'2rem'}}>
                <FormControl variant="standard">
                    <InputLabel htmlFor="component-simple">Agent Name</InputLabel>
                    <Input
                        id="component-simple"
                        value={agentName}
                        onChange={event => setAgentName(event.target.value)}
                        disabled={isReadOnly}
                    />
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
                disabled={isReadOnly}
            >
                <MenuItem value={Character.Jessica}>Jessica</MenuItem>
                <MenuItem value={Character.Antoc}>Antoc</MenuItem>
            </Select>
        </FormControl>

        </Box>
    )
}

export default Profile;