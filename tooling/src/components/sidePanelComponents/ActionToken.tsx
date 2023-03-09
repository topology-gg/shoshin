import React from "react";
import { Card } from "@mui/material";

const ActionToken = ({ children, selected, onClick }) => {
    return <Card
        sx={{
            border: "1px!important solid #ffffff00",
            width: "1.1rem",
            mr: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            bgcolor: selected
                    ? "info.light"
                    : "info.contrastText",
            color: selected
                ? "info.light"
                : "primary.main",
            ":hover": {
                color: "#85898A",
                border: "1px!important solid #ffffff00",
            },
        }}
        onClick={onClick}
        variant="outlined"
    >{children}</Card>
}    

export default ActionToken;