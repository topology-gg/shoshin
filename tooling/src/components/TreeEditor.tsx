import React from 'react';
import { Box } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';

const TreeEditor = ({tree, handleClickTreeEditor}) => {
    return(
        <Box>
            <IconButton onClick={(_)=>{handleClickTreeEditor(0)}}><CancelIcon/></IconButton>
            TREE EDITOR {tree}
        </Box>
    )
}

export default TreeEditor;
