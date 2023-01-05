import React from 'react';
import { Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { width } from '@mui/system';

const mentalStates = ["MS IDLE", "MS CLOSER", "MS DEFEND"]
const button_style = { marginTop:"0.5rem", marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem" };

const onClickTree = (i) => {
    console.log(`Tree ${i}`);
}

const MentalStates = ({}) => {
    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            mt: "1rem",
            width: "5vw"
        }}>
            {
                mentalStates.map( (name,i) => (
                    <button
                    style={{ ...button_style, marginLeft: "0.5rem" }}
                    onClick={() => onClickTree(i)}>
                        {`${name}`}
                    </button>
                ))
            }
        </Box>
    )
}

export default MentalStates;