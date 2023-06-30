import React from 'react';
import ActionToken from './ActionToken';
import { Action } from '../../types/Action';

interface SingleAction {
    disabled: boolean;
    unicode: string;
    duration: number;
    //Todo : add the rest types
    [key: string]: any;
}

const SingleAction = ({
    disabled,
    unicode,
    duration,
    onDoubleClick,
    actionIndex,
}: SingleAction) => {
    //1.1 rem per frame
    const handleDoubleClick = () => {
        console.log('double click');
        onDoubleClick(actionIndex);
    };
    const width = duration * 1.1;
    return (
        <div onDoubleClick={handleDoubleClick}>
            <ActionToken
                disabled={disabled}
                onClick={() => {}}
                selected={false}
                width={width}
            >
                <span style={{}}>{unicode}</span>
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
