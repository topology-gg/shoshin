import * as React from 'react';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FunctionsIcon from '@mui/icons-material/Functions';

const Tabs = () => {
  return (
    <Grid container spacing={10} sx={{display:"flex", justifyContent:"center"}}>
      <Grid item>
        <IconButton sx={{display: "flex"}}><PsychologyIcon/></IconButton>
      </Grid>
      <Grid item>
        <IconButton sx={{display: "flex"}}><AccountTreeIcon/></IconButton>
      </Grid>
      <Grid item>
        <IconButton sx={{display: "flex"}}><FunctionsIcon/></IconButton>
      </Grid>
    </Grid>
  );
}

export default Tabs;