import React, { useState, KeyboardEventHandler } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import SingleAction from './SingleAction';
import NewAction from './NewAction';
import {
    CHARACTERS_ACTIONS,
    ACTIONS_ICON_MAP,
    MAX_COMBO_SIZE,
    CHARACTER_ACTIONS_DETAIL,
    ACTIONS_TO_KEYS,
    ACTION_UNICODE_MAP,
} from '../../constants/constants';

const ComboEditor = ({
    isReadOnly,
    editingCombo,
    setEditingCombo,
    characterIndex,
    selectedIndex,
    setSelectedIndex,
    handleValidateCombo,
    displayButton,
}) => {
    const [selectedNewAction, setSelectedNewAction] = useState<boolean>(false);

    let actions = Object.keys(CHARACTERS_ACTIONS[characterIndex]).filter((a) =>
        isNaN(parseInt(a))
    );

    const handleInsertInstruction = (action) => {
        console.log('action:', action);
        if (editingCombo.length > MAX_COMBO_SIZE) {
            return;
        } else {
            setEditingCombo((prev) => {
                let action_int = parseInt(action, 10);
                let prev_copy = JSON.parse(JSON.stringify(prev));
                if (!isNaN(action_int)) {
                    prev_copy.push(action_int);
                }
                return prev_copy;
            });
        }
    };
    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (event.code === 'Backspace') {
            // Backspace - Remove last instruction
            setEditingCombo((prev) => {
                const new_program = prev.slice(0, -1);
                return new_program;
            });
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'left',
                alignItems: 'left',
                mt: '2rem',
            }}
        >
            <Typography variant="overline">Combo Actions</Typography>
            <Box>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        margin: '0rem 0 2rem 0',
                        justifyContent: 'center',
                    }}
                >
                    {actions.map((key, key_i) => {
                        if (!key.includes('COMBO')) {
                            const frameString =
                                CHARACTER_ACTIONS_DETAIL[characterIndex][key]
                                    .duration == 1
                                    ? 'frame'
                                    : 'frames';
                            const actionDuration =
                                CHARACTER_ACTIONS_DETAIL[characterIndex][key]
                                    .duration;
                            let actionActiveFramesString =
                                CHARACTER_ACTIONS_DETAIL[characterIndex][
                                    key
                                ].active?.join(', ');
                            if (actionActiveFramesString != null) {
                                actionActiveFramesString =
                                    'Active Frame # : ' +
                                    actionActiveFramesString +
                                    '. ';
                            }

                            return (
                                <Tooltip
                                    key={`${key}`}
                                    title={
                                        <React.Fragment>
                                            <Typography color="inherit">{`${key.replaceAll(
                                                '_',
                                                ' '
                                            )}`}</Typography>
                                            <p>
                                                <em>{'Duration : '}</em>{' '}
                                                <b>{actionDuration}</b>{' '}
                                                {`${frameString}`}.{' '}
                                            </p>
                                            <p>{actionActiveFramesString}</p>
                                        </React.Fragment>
                                    }
                                >
                                    <div
                                        key={`iconized-action-${key_i}`}
                                        className={'comboActionDiv'}
                                        onClick={() => {
                                            handleInsertInstruction(key_i);
                                        }}
                                    >
                                        <span style={{}}>
                                            {ACTION_UNICODE_MAP[key]}
                                        </span>

                                        <p
                                            style={{
                                                marginTop: '0.1rem',
                                                marginBottom: '0',
                                            }}
                                        >
                                            {
                                                ACTIONS_TO_KEYS[characterIndex][
                                                    key
                                                ]
                                            }
                                        </p>
                                    </div>
                                </Tooltip>
                            );
                        }
                    })}
                </Box>
                <div
                    style={{
                        height: '25px',
                        margin: '0 0 0.5rem 0',
                        position: 'relative',
                        display: 'flex',
                    }}
                >
                    {editingCombo.map((action, index) => (
                        <SingleAction
                            key={`action-${index}`}
                            disabled={isReadOnly}
                            action={action}
                            characterIndex={characterIndex}
                        />
                    ))}

                    {isReadOnly ? (
                        <></>
                    ) : (
                        <>
                            <NewAction
                                disabled={isReadOnly}
                                onInsert={handleInsertInstruction}
                                onKeyDown={handleKeyDown}
                                onSelect={() => {
                                    setSelectedNewAction(true);
                                }}
                                onBlur={() => {
                                    setSelectedNewAction(false);
                                }}
                                selected={selectedNewAction}
                                characterIndex={characterIndex}
                            />
                            {displayButton && (
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        handleValidateCombo(
                                            editingCombo,
                                            selectedIndex
                                        );
                                        setEditingCombo([]);
                                        setSelectedIndex(null);
                                    }}
                                    disabled={isReadOnly}
                                >
                                    Confirm
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </Box>
        </Box>
    );
};

export default ComboEditor;
