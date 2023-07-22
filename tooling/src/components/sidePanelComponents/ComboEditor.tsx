import React, { useState, SyntheticEvent, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { ACTIONS_TO_KEYS } from '../../constants/constants';
import Actions from '../ComboEditor/Actions';
import { Action, Rest } from '../../types/Action';

interface ComboEditor {
    isReadOnly: boolean;
    editingCombo: Action[];
    characterIndex: number;
    selectedIndex: number;
    handleValidateCombo: (combo: Action[], index: number) => void;
    setEditingCombo?: (combo: Action[]) => void;
    actions: Action[];
}

const ComboEditor = ({
    isReadOnly,
    editingCombo,
    setEditingCombo,
    characterIndex,
    selectedIndex,
    handleValidateCombo,
    actions,
}: ComboEditor) => {
    const [selectedNewAction, setSelectedNewAction] = useState<boolean>(false);

    const handleKeyPress = (ev: KeyboardEvent) => {
        const key = ev.key.toUpperCase();

        console.log('keypress', key);

        if (key.includes('BACKSPACE')) {
            let prev_copy = editingCombo.slice(0, -1);
            setEditingCombo?.(prev_copy);
            handleValidateCombo(prev_copy, selectedIndex);
            return;
        }
        const action = actions.find((action) => action.key == key);

        if (action !== undefined) {
            let prev_copy: Action[] = JSON.parse(JSON.stringify(editingCombo));
            prev_copy.push(action);
            setEditingCombo?.(prev_copy);
            handleValidateCombo(prev_copy, selectedIndex);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [editingCombo]);

    //remove an action
    const handleActionDoubleClick = (index) => {
        let prev_copy = JSON.parse(JSON.stringify(editingCombo));
        prev_copy.splice(index, 1);

        setEditingCombo?.(prev_copy);

        handleValidateCombo(prev_copy, selectedIndex);
    };

    const handleActionAddClick = (e: SyntheticEvent<HTMLDivElement>) => {
        //id is iconized-action-${key_i}
        const action_int = parseInt(e.currentTarget.id.split('-')[2]);
        //const action_int = actions[index];

        let prev_copy: Action[] = JSON.parse(JSON.stringify(editingCombo));
        if (!isNaN(action_int)) {
            let action = actions[action_int];
            prev_copy.push(action);
        }
        setEditingCombo?.(prev_copy);
        handleValidateCombo(prev_copy, selectedIndex);
    };

    const handleClearEditingCombo = () => {
        const newEditingCombo = [];
        setEditingCombo?.(newEditingCombo);
        handleValidateCombo(newEditingCombo, selectedIndex);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'left',
                alignItems: 'left',
            }}
        >
            <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                Available Actions:
            </Typography>
            <Box>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        margin: '0rem 0 0rem 0',
                        justifyContent: 'space-evenly',
                    }}
                >
                    {actions.map((action, index) => {
                        const frameString =
                            action.frames.duration == 1 ? 'frame' : 'frames';

                        let actionActiveFramesString = action.frames?.active
                            ?.length
                            ? action.frames?.active[0].toString()
                            : null;

                        if (actionActiveFramesString != null) {
                            actionActiveFramesString =
                                'Active Frame # : ' +
                                actionActiveFramesString +
                                '. ';
                        }

                        return (
                            <Tooltip
                                key={`${action.id}`}
                                title={
                                    <React.Fragment>
                                        <Typography color="inherit">
                                            {action.display.name}
                                        </Typography>
                                        <p>
                                            <em>{'Duration : '}</em>{' '}
                                            <b>{action.frames.duration}</b>{' '}
                                            {`${frameString}`}.{' '}
                                        </p>
                                        <p>{actionActiveFramesString}</p>
                                    </React.Fragment>
                                }
                                placement="top"
                            >
                                <div
                                    key={`iconized-action-${index}`}
                                    id={`iconized-action-${index}`}
                                    className={'comboActionDiv'}
                                    onClick={handleActionAddClick}
                                >
                                    {/* <span style={{}}>
                                        {action.display.unicode}
                                    </span> */}

                                    <img
                                        src={action.display.icon}
                                        width="24px"
                                        style={{ margin: '0 auto' }}
                                    />

                                    <p
                                        style={{
                                            marginTop: '0.1rem',
                                            marginBottom: '0',
                                        }}
                                    >
                                        {
                                            ACTIONS_TO_KEYS[characterIndex][
                                                action.display.name
                                            ]
                                        }
                                    </p>
                                </div>
                            </Tooltip>
                        );
                    })}
                </Box>

                <Box
                    sx={{
                        textAlign: 'right',
                        pr: 1.5,
                        mt: 1,
                        mb: 2,
                        fontSize: '12px',
                    }}
                >
                    <Tooltip
                        key={`combo-clearing-span-tooltip`}
                        title={
                            <React.Fragment>
                                <Typography color="inherit">
                                    Clear this combo
                                </Typography>
                            </React.Fragment>
                        }
                        placement="left"
                    >
                        <u
                            onClick={handleClearEditingCombo}
                            className={'hoverable'}
                        >
                            Clear
                        </u>
                    </Tooltip>
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
                        handleActionDoubleClick={handleActionDoubleClick}
                        isReadOnly={isReadOnly}
                        combo={editingCombo}
                        onChange={(newCombo: Action[]) => {
                            handleValidateCombo(newCombo, selectedIndex);
                            setEditingCombo?.(newCombo);
                        }}
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
