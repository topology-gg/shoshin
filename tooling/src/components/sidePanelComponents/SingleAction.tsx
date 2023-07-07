import React from 'react';
import ActionToken from './ActionToken';
import { Action } from '../../types/Action';

interface SingleAction {
    disabled: boolean;
    action: Action;
    actionIndex: number;
    onDoubleClick: (index: number) => void;
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
                <span style={{}}>{action.display.unicode}</span>
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
        </div>
    );
};

export default SingleAction;
