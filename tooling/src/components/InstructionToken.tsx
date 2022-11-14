import { SxProps, Theme } from "@mui/material";
import Card from "@mui/material/Card";
import React, { MouseEventHandler, type ReactNode } from "react";

const InstructionToken = ({
    children,
    onClick,
    active,
    selected,
    sx,
}: {
    children: ReactNode;
    onClick: MouseEventHandler;
    active?: boolean;
    selected?: boolean;
    sx?: SxProps<Theme>;
}) => {
    return (
        <Card
            sx={{
                width: "1.1rem",
                mr: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                bgcolor: selected
                    ? "secondary.main"
                    : active
                    ? "primary.light"
                    : "transparent",
                color: selected
                    ? "secondary.contrastText"
                    : "primary.contrastText",
                ":hover": {
                    bgcolor: selected ? "secondary.main" : "secondary.light",
                    color: "secondary.contrastText",
                },
                ...sx,
            }}
            variant="outlined"
            onClick={onClick}
        >
            {children}
        </Card>
    );
};

export default InstructionToken;
