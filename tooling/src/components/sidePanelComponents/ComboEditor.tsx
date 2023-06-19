import React, { useState, KeyboardEventHandler, SyntheticEvent } from 'react';
import { Box, Button, Input, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import NewAction from './NewAction';
import {
    CHARACTERS_ACTIONS,
    ACTIONS_ICON_MAP,
    MAX_COMBO_SIZE,
    CHARACTER_ACTIONS_DETAIL,
    ACTIONS_TO_KEYS,
    ACTION_UNICODE_MAP,
} from '../../constants/constants';
import Actions from '../ComboEditor/Actions';

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

    //remove an action
    const handleActionDoubleClick = (index) => {
        console.log('handled', index);

        let prev_copy = JSON.parse(JSON.stringify(editingCombo));
        prev_copy.splice(index, 1);

        setEditingCombo(prev_copy);

        handleValidateCombo(prev_copy, selectedIndex);
    };

    const handleActionAddClick = (e: SyntheticEvent<HTMLDivElement>) => {
        //id is iconized-action-${key_i}
        const action_int = parseInt(e.currentTarget.id.split('-')[2]);
        //const action_int = actions[index];

        console.log('editing combo', editingCombo);
        console.log('selected index', selectedIndex);

        let prev_copy = JSON.parse(JSON.stringify(editingCombo));
        if (!isNaN(action_int)) {
            prev_copy.push(action_int);
        }
        setEditingCombo(prev_copy);
        handleValidateCombo(prev_copy, selectedIndex);
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
                                        className={'comboActionDiv'}
                                        onClick={handleActionAddClick}
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
                    <Actions
                        characterIndex={characterIndex}
                        handleActionDoubleClick={handleActionDoubleClick}
                        isReadOnly={isReadOnly}
                        combo={editingCombo}
                        onChange={(newCombo) => setEditingCombo(newCombo)}
                    />
                </div>
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ mt: 2 }}
                >
                    Click an action to add, double click to remove. Drag to
                    change order.
                </Typography>
            </Box>
        </Box>
    );
};

export default ComboEditor;
