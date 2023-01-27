import * as React from 'react';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import FunctionsIcon from '@mui/icons-material/Functions';

const selectColor = (tab: number, workingTab: number) => {
  let same = tab == workingTab;
  return same && "black" || !same && "grey"
}

const Tabs = ({workingTab, handleClickTab}) => {
  return (
    <Grid container spacing={0} sx={{display:"flex", justifyContent:"center"}}>
      <Grid display={"flex"} justifyContent={"space-around"} xs={4} item>
        <IconButton sx={{color:selectColor(0, workingTab)}} onClick={(_)=>handleClickTab(0)}><PsychologyAltIcon/></IconButton>
      </Grid>
      <Grid display={"flex"} justifyContent={"space-around"} xs={4} item>
        <IconButton sx={{color:selectColor(1, workingTab)}} onClick={(_)=>handleClickTab(1)}><PsychologyIcon/></IconButton>
      </Grid>
      <Grid display={"flex"} justifyContent={"space-around"} xs={4} item>
        <IconButton sx={{color:selectColor(2, workingTab)}} onClick={(_)=>handleClickTab(2)}><FunctionsIcon/></IconButton>
      </Grid>
    </Grid>
  );
}

export default Tabs;