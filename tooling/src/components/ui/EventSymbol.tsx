import { Box } from "@mui/material";
import React from "react";

export type EventType = "hurt" | "knocked";

const EventSymbol = ({ type }: { type: EventType }) => {
    const color =
        type === "hurt"
            ? "warning.main"
            : type === "knocked"
            ? "error.main"
            : null;
    return (
        <Box
            sx={{
                borderRadius: 10,
                border: 2,
                color,
                width: 10,
                height: 10,
                backgroundColor: "white",
            }}
        />
    );
};

export default EventSymbol;
