import { Menu, MenuItem } from '@mui/material';
import React from 'react';
import { ConditionLabel } from './Condition';
import BlurrableListItemText from '../../ui/BlurrableListItemText';
import { Condition } from '../../../types/Condition';

type ConditionMenuProps = {
    anchorEl: Element;
    conditions: Condition[];
    onClose: () => void;
    onSelect: (condition: Condition) => void;
    open: boolean;
};

const ConditionsMenu = ({
    anchorEl,
    conditions,
    onClose,
    onSelect,
    open,
}: ConditionMenuProps) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => onClose()}
            PaperProps={{
                style: {
                    maxHeight: 220,
                    backgroundColor: '#000',
                },
            }}
        >
            {conditions.map((condition) => {
                return (
                    <MenuItem>
                        <BlurrableListItemText
                            onClick={(e) => {
                                onSelect(condition);
                            }}
                        >
                            <ConditionLabel
                                name={condition.displayName}
                                type={condition.type}
                            />
                        </BlurrableListItemText>
                    </MenuItem>
                );
            })}
        </Menu>
    );
};

export default ConditionsMenu;
