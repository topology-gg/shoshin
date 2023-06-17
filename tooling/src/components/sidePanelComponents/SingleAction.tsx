import React from 'react';
import {
    ACTIONS_ICON_MAP,
    CHARACTERS_ACTIONS,
    CHARACTER_ACTIONS_DETAIL,
} from '../../constants/constants';
import ActionToken from './ActionToken';

const SingleAction = ({
    disabled,
    action,
    characterIndex,
    onDoubleClick,
    actionIndex,
}) => {
    const actionDuration =
        CHARACTER_ACTIONS_DETAIL[characterIndex][
            CHARACTERS_ACTIONS[characterIndex][action]
        ].duration;

    //1.1 rem per frame

    const handleDoubleClick = () => {
        console.log('double click');
        onDoubleClick(actionIndex);
    };
    const width = actionDuration * 1.1;
    return (
        <div onDoubleClick={handleDoubleClick}>
            <ActionToken
                disabled={disabled}
                onClick={() => {}}
                selected={false}
                width={width}
            >
                <i className="material-icons" style={{ fontSize: '1rem' }}>
                    {
                        ACTIONS_ICON_MAP[
                            CHARACTERS_ACTIONS[characterIndex][action]
                        ]
                    }
                </i>
            </ActionToken>
        </div>
    );
};

export default SingleAction;
