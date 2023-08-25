import { Collapse, List, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { ConditionLabel } from './Condition';
import BlurrableListItemText from '../../ui/BlurrableListItemText';
import { Condition } from '../../../types/Condition';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

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
    const byCategory: Record<string, Condition[]> = conditions.reduce(
        (res: Record<string, Condition[]>, condition) => {
            res[condition.type] = res[condition.type] ?? [];
            res[condition.type].push(condition);
            return res;
        },
        {}
    );
    const [openCategory, setOpenCategory] = useState<string>();

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => onClose()}
            PaperProps={{
                style: {
                    maxHeight: 220,
                    width: 290,
                    backgroundColor: '#000',
                },
            }}
        >
            {Object.entries(byCategory).map(([category, conditions]) => {
                const isNoCategory =
                    category === 'undefined' || conditions.length === 1;
                const categoryDisplayName = category.replace(
                    /(^\w|\s\w)/g,
                    (m) => m.toUpperCase()
                );
                return (
                    <>
                        {!isNoCategory && (
                            <MenuItem
                                onClick={() =>
                                    setOpenCategory((prev) =>
                                        prev === category ? null : category
                                    )
                                }
                            >
                                <BlurrableListItemText>
                                    <ConditionLabel
                                        name={categoryDisplayName}
                                        type={category}
                                    />
                                </BlurrableListItemText>
                                {openCategory === category ? (
                                    <ExpandLess color="info" />
                                ) : (
                                    <ExpandMore color="info" />
                                )}
                            </MenuItem>
                        )}
                        <Collapse
                            in={openCategory === category || isNoCategory}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List component="div" disablePadding>
                                {conditions.map((condition) => (
                                    <MenuItem>
                                        <BlurrableListItemText
                                            sx={{ pl: isNoCategory ? 0 : 4 }}
                                            onClick={() => onSelect(condition)}
                                        >
                                            <ConditionLabel
                                                name={condition.displayName}
                                                type={condition.type}
                                            />
                                        </BlurrableListItemText>
                                    </MenuItem>
                                ))}
                            </List>
                        </Collapse>
                    </>
                );
            })}
        </Menu>
    );
};

export default ConditionsMenu;
