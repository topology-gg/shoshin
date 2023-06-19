import React from 'react';
import { ACTIONS_ICON_MAP } from '../../constants/constants';
import ActionToken from './ActionToken';
import { Action } from '../../types/Action';

interface SingleAction {
    disabled: boolean;
    action: Action;
    //Todo : add the rest types
    [key: string]: any;
}

const SingleAction = ({
    disabled,
    action,
    onDoubleClick,
    actionIndex,
}: SingleAction) => {
    //1.1 rem per frame
    const handleDoubleClick = () => {
        console.log('double click');
        onDoubleClick(actionIndex);
    };
    const width = action.frames.duration * 1.1;
    return (
        <div onDoubleClick={handleDoubleClick}>
            <ActionToken
                disabled={disabled}
                onClick={() => {}}
                selected={false}
                width={width}
            >
                <i className="material-icons" style={{ fontSize: '1rem' }}>
                    {ACTIONS_ICON_MAP[action.display.name]}
                </i>
            </ActionToken>
        </div>
    );
};

export default SingleAction;
