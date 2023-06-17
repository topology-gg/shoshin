import React from 'react';
import {
    ACTIONS_ICON_MAP,
    CHARACTERS_ACTIONS,
    CHARACTER_ACTIONS_DETAIL,
} from '../../constants/constants';
import ActionToken from './ActionToken';
import { Draggable } from 'react-beautiful-dnd';

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

export const DraggableSingleAction = ({
    disabled,
    action,
    characterIndex,
    onDoubleClick,
    actionIndex,
}) => {
    return (
        <Draggable draggableId={actionIndex.toString()} index={actionIndex}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                    {...provided.dragHandleProps}
                >
                    <SingleAction
                        disabled={disabled}
                        action={action}
                        characterIndex={characterIndex}
                        onDoubleClick={onDoubleClick}
                        actionIndex={actionIndex}
                    />
                </div>
            )}
        </Draggable>
    );
};

export default SingleAction;
