import React from 'react';
import { Card } from '@mui/material';

const ActionToken = ({ children, disabled, selected, onClick }) => {
    return (
        <Card
            sx={{
                border: '1px!important solid #ffffff00',
                width: '1.1rem',
                mr: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: disabled ? 'default' : 'pointer',
                bgcolor: selected ? 'info.light' : 'info.contrastText',
                color: selected ? 'info.light' : 'primary.main',
                ':hover': disabled
                    ? {}
                    : {
                          color: '#85898A',
                          border: '1px!important solid #ffffff00',
                      },
            }}
            onClick={disabled ? () => {} : onClick}
            variant="outlined"
        >
            {children}
        </Card>
    );
};

export default ActionToken;
