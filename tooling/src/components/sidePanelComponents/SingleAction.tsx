import React from 'react';
import ActionToken from './ActionToken';
import { Badge, BadgeProps, styled } from '@mui/material';

const ActionBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
        top: '50%',
        left: '3px',
        transform: 'translate(0, -50%)',
        padding: '0 3px',
        height: '16px',
        minWidth: '16px',
        backgroundColor: '#f2f2f2',
        opacity: 0.8,
    },
}));

interface SingleAction {
    disabled: boolean;
    actionIndex: number;
    onDoubleClick: (index: number) => void;
    unicode: string;
    icon?: string;
    duration: number;
    //Todo : add the rest types
    [key: string]: any;
}

const SingleAction = ({
    disabled,
    unicode,
    icon,
    duration,
    onDoubleClick,
    actionIndex,
}: SingleAction) => {
    //1.1 rem per frame
    const handleDoubleClick = () => {
        console.log('double click');
        onDoubleClick(actionIndex);
    };
    const width = duration * 2.0;
    const durationDimension = 14;
    const nudge = 3;
    return (
        <div onDoubleClick={handleDoubleClick}>
            <ActionBadge
                badgeContent={duration}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <ActionToken
                    disabled={disabled}
                    onClick={() => {}}
                    selected={false}
                    width={width}
                >
                    <img
                        src={icon}
                        width="30px"
                        style={{ margin: '0 auto' }}
                        unselectable="on"
                    />

                    {/* <span style={{}}>{unicode}</span> */}
                    {/* <p
                    style={{
                        marginTop: '0.1rem',
                        marginBottom: '0',
                    }}
                >
                    {
                        action.display.name
                    }
                </p> */}
                </ActionToken>
            </ActionBadge>
        </div>
    );
};

export default SingleAction;
