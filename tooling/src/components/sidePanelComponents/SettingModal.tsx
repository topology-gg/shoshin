import { CSSProperties, useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import { Trans, useTranslation } from "react-i18next";
import ConnectWallet from "../ConnectWallet";
import { Box, Button, SxProps } from "@mui/material";

export default function SettingModal({
    modalMode, handleSetModalMode,
    open, handleSetOpen,
}) {

    const { t } = useTranslation();

    // store current language as state
    // note: setting modal openness and modal rendering mode are parent's states and current language as states
    const [currLang, setCurrLang] = useState<string>('en')

    // handle state changes upon request
    const handleOpen = () => {
        handleSetModalMode('conect'); // always open setting modal from menu mode
        handleSetOpen(true);
    };
    const handleClose = () => {handleSetOpen(false);};
    const handleBack = () => { handleSetModalMode('connect'); };
    const handleModeChange = (mode: string) => { handleSetModalMode(mode); };

    // compute props
    const modalWidth =
        modalMode == 'connect' ? 450 :
        1100 // leaderboard width

    // render
    return (
        <div style={{margin:'0 6px 0 0', verticalAlign:'middle'}}>

            <Button onClick={handleOpen} >
                <i className="material-icons" style={{ fontSize: "1rem", paddingTop:'0.1rem' }}>
                    settings
                </i>
            </Button>

            <Modal
                isRoot={modalMode == 'connect'} open={open} width={modalWidth}
                onClose={handleClose} onBack={handleBack} maxWidth={false}
            >
                <Box sx={{
                    pt: 3, pb: 0, pl: 0, pr: 0, fontFamily: "var(--font-family-secondary)"
                }}>
                    {
                        (modalMode == 'connect') ? (
                            <ConnectWallet />
                        ) : <></>
                    }

                </Box>
            </Modal>

        </div>
    );
}
