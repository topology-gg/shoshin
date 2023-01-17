import React from "react";
import { Button } from "@mui/material";

const ValidateCombo = ({
    onValidateCombo,
}) => {
    return (
        <Button
        onClick={onValidateCombo}
        sx={{
            border: '1px solid black',
            marginLeft: '0.4rem',
            width: '1.1rem',
            display: 'flex',
            cursor: 'pointer',
            ':hover': {
                backgroundColor: '#2EE59D',
                boxShadow: '0px 15px 20px rgba(46, 229, 157, 0.4)',
                color: '#fff',
                transform: 'translateY(-4px)',
            },
        }}
        >
            Confirm
        </Button>
    );
};

export default ValidateCombo;
