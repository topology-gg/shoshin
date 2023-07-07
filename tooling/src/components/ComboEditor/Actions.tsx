import React, { useCallback } from 'react';
import {
    DragDropContext,
    Draggable,
    DraggableChildrenFn,
    Droppable,
    OnDragEndResponder,
} from 'react-beautiful-dnd';
import SingleAction from '../sidePanelComponents/SingleAction';
import { Action } from '../../types/Action';

interface Actions {
    isReadOnly: boolean;
    combo: Action[];
    onChange: (actions: Action[]) => void;
    handleActionDoubleClick: (index: number) => void;
}

const Actions = ({
    combo,
    handleActionDoubleClick,
    isReadOnly,
    onChange,
}: Actions) => {
    //Reorder combos in an action
    const onDragEnd: OnDragEndResponder = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (destination.index === source.index) {
            return;
        }

        let prev_copy = JSON.parse(JSON.stringify(combo));
        const [removedItem] = prev_copy.splice(source.index, 1);
        prev_copy.splice(destination.index, 0, removedItem);

        onChange(prev_copy);
    };

    const renderAction = useCallback<DraggableChildrenFn>(
        (provided, _snapshot, rubric) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                style={{
                    ...provided.draggableProps.style,
                }}
                {...provided.dragHandleProps}
            >
                <SingleAction
                    key={`action-${rubric.source.index}`}
                    disabled={isReadOnly}
                    action={combo[rubric.source.index]}
                    onDoubleClick={handleActionDoubleClick}
                    actionIndex={rubric.source.index}
                />
            </div>
        ),
        [combo, isReadOnly, handleActionDoubleClick]
    );

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
                droppableId="droppable"
                direction="horizontal"
                renderClone={renderAction}
                // Uses a separate container in body to work around
                // issues with position: fixed and transforms
                getContainerForClone={() =>
                    document.querySelector('#draggable-portal')
                }
            >
                {(provided) => (
                    <div
                        style={{ width: '100%', display: 'flex' }}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {combo.map((_action, index) => (
                            <Draggable
                                draggableId={index.toString()}
                                index={index}
                            >
                                {renderAction}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Actions;
