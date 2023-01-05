import * as React from 'react';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FunctionsIcon from '@mui/icons-material/Functions';


const Tabs = ({handleClickTab}) => {
  return (
    <Grid container spacing={0} sx={{display:"flex", justifyContent:"center"}}>
      <Grid display={"flex"} justifyContent={"space-around"} xs={6} item>
        <IconButton onClick={(_)=>handleClickTab(0)}><PsychologyIcon/></IconButton>
      </Grid>
      <Grid display={"flex"} justifyContent={"space-around"} xs={6} item>
        <IconButton onClick={(_)=>handleClickTab(1)}><FunctionsIcon/></IconButton>
      </Grid>
    </Grid>
  );
}

export default Tabs;