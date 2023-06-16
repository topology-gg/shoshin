import React, { useState, KeyboardEventHandler, SyntheticEvent } from 'react';
import { Box, Button, Input, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import SingleAction from './SingleAction';
import NewAction from './NewAction';
import {
    CHARACTERS_ACTIONS,
    ACTIONS_ICON_MAP,
    MAX_COMBO_SIZE,
    CHARACTER_ACTIONS_DETAIL,
    ACTIONS_TO_KEYS,
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

    const handleActionDoubleClick = (index) => {
        console.log('handled', index);
        setEditingCombo((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy.splice(index, 1);
            return prev_copy;
        });

        handleValidateCombo(editingCombo, selectedIndex);
    };

    const handleActionAddClick = (e: SyntheticEvent<HTMLDivElement>) => {
        //id is iconized-action-${key_i}
        const action_int = parseInt(e.currentTarget.id.split('-')[2]);
        //const action_int = actions[index];
        setEditingCombo((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            if (!isNaN(action_int)) {
                prev_copy.push(action_int);
            }
            return prev_copy;
        });

        handleValidateCombo(editingCombo, selectedIndex);
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
                                        id={`iconized-action-${key_i}`}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textAlign: 'center',
                                            width: '2.5rem',
                                            marginRight: '0.3rem',
                                            padding: '0.3rem',
                                            border: '1px solid #CCCCCC',
                                            borderRadius: '0.8rem',
                                            transitionDuration: '50ms',
                                            cursor: 'pointer',
                                        }}
                                        onClick={handleActionAddClick}
                                    >
                                        <i
                                            className="material-icons"
                                            style={{ fontSize: '1rem' }}
                                        >
                                            {ACTIONS_ICON_MAP[key]}
                                        </i>
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
                            onDoubleClick={handleActionDoubleClick}
                            actionIndex={index}
                        />
                    ))}

                    {editingCombo.length == 0 ? (
                        <Typography variant="body1" color="textSecondary">
                            Click an action to add, double click to remove
                        </Typography>
                    ) : null}
                </div>
            </Box>
        </Box>
    );
};

export default ComboEditor;
