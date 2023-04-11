import { CSSProperties, useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import { Trans, useTranslation } from "react-i18next";
import ConnectWallet from "../ConnectWallet";
import { Box, Button, SxProps } from "@mui/material";

export default function WalletConnectView({
}) {

    // render
    return (
        <Box sx={{
            fontFamily: "var(--font-family-secondary)"
        }}>
            <ConnectWallet />
        </Box>
    );
}
