import * as React from 'react';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FunctionsIcon from '@mui/icons-material/Functions';


const Tabs = ({handleClickTab}) => {
  return (
    <Grid container spacing={8} sx={{display:"flex", justifyContent:"center"}}>
      <Grid item>
        <IconButton sx={{display: "flex"}} onClick={(_)=>handleClickTab(0)}><PsychologyIcon/></IconButton>
      </Grid>
      <Grid item>
        <IconButton sx={{display: "flex"}} onClick={(_)=>handleClickTab(1)}><AccountTreeIcon/></IconButton>
      </Grid>
      <Grid item>
        <IconButton sx={{display: "flex"}} onClick={(_)=>handleClickTab(2)}><FunctionsIcon/></IconButton>
      </Grid>
    </Grid>
  );
}

export default Tabs;