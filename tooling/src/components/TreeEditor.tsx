import React from 'react';
import { Box } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DecisionTree from './DecisionTree'

const data = {
    nodes: [
        { data: { id: 'if F1' } },
        { data: { id: 'MS DEFEND' } },
        { data: { id: 'if F2' } },
        { data: { id: 'MS CHILL' } },
        { data: { id: 'if F3' } },
        { data: { id: 'MS CLOSER' } },
        { data: { id: 'MS AGGRO' } },
    ],
    edges: [
        { data: { source: 'if F1', target: 'MS DEFEND' } },
        { data: { source: 'if F1', target: 'if F2' } },
        { data: { source: 'if F2', target: 'MS CHILL' } },
        { data: { source: 'if F2', target: 'if F3' } },
        { data: { source: 'if F3', target: 'MS CLOSER' } },
        { data: { source: 'if F3', target: 'MS AGGRO' } },
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
                <DecisionTree data={data} height={300} width={593}></DecisionTree>
            </Box>
        </Box>
    )
}

export default TreeEditor;
