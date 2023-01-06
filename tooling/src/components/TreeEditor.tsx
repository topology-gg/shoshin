import React from 'react';
import { Box } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DecisionTree from './DecisionTree'

const data = {
    name: 'if F1',
    children: [
        { 
            name: 'if F2',
            children: [{name : 'MS DEFEND'}, {name: 'MS CHILL'}]
        },
        { 
            name: 'if F3',
            children: [{name : 'MS CLOSER'}, {name: 'MS AGGRO'}]
        },
    ]
  };


const TreeEditor = ({tree, mentalState, handleClickTreeEditor}) => {
    return(
        <Box
        sx={{
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "flex-start",
            mt: "1rem",
        }}>
            <IconButton onClick={(_)=>{handleClickTreeEditor(0)}}><CancelIcon/></IconButton>
            <Box
            sx={{
                mt: "1rem",
                ml: "1rem",
                minWidth:"30vw"
            }}>
                <TextField
                color={"info"}
                id="outlined-multiline-static"
                label={`Decision Tree for ${mentalState}`}
                fullWidth
                multiline
                rows={10}
                />
            </Box>
            <Box
            sx={{
                mt: "1rem",
                ml: "1rem",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                minWidth: "30vw",
            }}>
                <DecisionTree data={data} width={300} height={300} />
            </Box>
        </Box>
    )
}

export default TreeEditor;
