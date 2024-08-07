import React from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

import { Breakpoint } from '@mui/material';

interface ModalProps {
    children: React.ReactNode;
    open: boolean;
    onClose?: () => void;
    onBack?: () => void;
    maxWidth?: false | Breakpoint;
    padding?: number;
    width?: number;
}

const Modal = ({
    children,
    open,
    onClose,
    maxWidth = 'sm',
    padding = 0,
    width = 600,
}: ModalProps) => {
    const sx = {
        p: padding,
        border: 1,
        borderRadius: 4,
        width: width,
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={true}
            PaperProps={{ sx: sx }}
        >
            {
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        width: 30,
                        height: 30,
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            }

            {children}
        </Dialog>
    );
};

export default Modal;
