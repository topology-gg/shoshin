import { Box, SxProps } from "@mui/system";
import React from "react";

const SwipeableContent = ({
    children,
    sx = {},
    ...props
}: {
    children: React.ReactNode;
    sx?: SxProps
}) => {
    return (
        <Box
            /**
             * The content occupies the remainder of the screen (100vh - the tabs)
             * It will need to be changed manually, when the height of the tabs change
             */
            sx={{ ...sx, height: "calc(100vh - 104px)", overflowX: "scroll" }}
            {...props}
        >
            {children}
        </Box>
    );
};

export default SwipeableContent;
