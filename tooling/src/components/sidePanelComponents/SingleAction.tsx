import React from 'react';
import ActionToken from './ActionToken';
import { Badge, BadgeProps, Tooltip, Typography, styled } from '@mui/material';
import { Timelapse } from '@mui/icons-material';
import { Action } from '../../types/Action';

const ActionBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
        top: '50%',
        left: '3px',
        transform: 'translate(0, -50%)',
        padding: '0 3px',
        height: '16px',
        minWidth: '16px',
        opacity: 0.8,
    },
}));

interface SingleAction {
    action: Action;
    disabled: boolean;
    actionIndex: number;
    onDoubleClick: (index: number) => void;
    duration: number;
    //Todo : add the rest types
    [key: string]: any;
}

const SingleAction = ({
    action,
    disabled,
    duration,
    onDoubleClick,
    actionIndex,
}: SingleAction) => {
    //1.1 rem per frame
    const handleDoubleClick = () => {
        onDoubleClick(actionIndex);
    };
    const width = duration * 2.0;
    return (
        <div onDoubleClick={handleDoubleClick}>
            <Tooltip
                placement="top"
                title={
                    <>
                        <Typography color="white">
                            {action.display.name}
                        </Typography>
                        <Typography color="white">
                            Duration: {duration}{' '}
                            {duration > 1 ? 'frames' : 'frame'}
                        </Typography>
                    </>
                }
            >
                <ActionBadge
                    badgeContent={
                        <>
                            <Timelapse
                                fontSize="small"
                                color="info"
                                sx={{ mr: '2px' }}
                            />
                            {duration}
                        </>
                    }
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                    <ActionToken
                        disabled={disabled}
                        onClick={() => {}}
                        selected={false}
                    >
                        <img
                            src={action.display.icon}
                            width="30px"
                            style={{ margin: '0 auto' }}
                            unselectable="on"
                        />
                    </ActionToken>
                </ActionBadge>
            </Tooltip>
        </div>
    );
};

export default SingleAction;
