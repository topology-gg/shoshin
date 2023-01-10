import React from 'react';
import { Box, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';

const button_style = { marginBottom:"0.5rem", marginTop:"0.5rem", marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem"};

let mentalState = "";

const MentalStates = ({mentalStates, handleAddMentalState, handleClickRemoveMentalState, handleClickTreeEditor}) => {
    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            mt: "1rem",
        }}>
            <Grid container spacing={0}>
                <Grid sx={{
                    display:"flex",
                    alignItems:"flex-end",
                    justifyContent:"space-around"
                    }} xs={2} item>
                    <IconButton onClick={(_)=>{
                        if (mentalState){
                            handleAddMentalState(mentalState);
                        }
                    }}><AddIcon/></IconButton>
                </Grid>
                <Grid xs={10} item>
                    <TextField color={"info"} fullWidth id="standard-basic" label="Input Mental State" variant="standard" onChange={(event) => {mentalState = event.target.value}}/>
                </Grid>
            </Grid>
            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "left",
                alignItems: "left",
                mt: "1rem",
            }}
            >
                {
                    mentalStates.map( (name: string, i: number) => (
                        <Box
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
                                {`${name}`}
                            </button>
                            <IconButton onClick={(_)=>handleClickRemoveMentalState(i)}><DeleteIcon sx={{fontSize:"small"}}/></IconButton>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
}

export default MentalStates;