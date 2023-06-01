import * as React from 'react';
import { Box, Tab, Tabs as MuiTabs } from '@mui/material';
import {
    SportsMartialArts,
    SelfImprovement,
    PsychologyAlt,
    Psychology,
    Functions,
    ViewWeek,
    Person,
} from '@mui/icons-material';

// export enum for tab names
export enum EditorTabName {
    Profile = 'Profile',
    Mind = 'Mind',
    Combos = 'Combos',
    Conditions = 'Conditions',
}

const EditorTabs = ({ workingTab, handleClickTab }) => {
    const BLANK_COLOR = '#DDDDDD';
    const tabStyle = (value, target) => {
        return {
            borderBottom: 'none',
            backgroundColor: BLANK_COLOR + (value == target ? 'FF' : '55'),
            color: value == target ? '#333333' : '#BBBBBB',
            borderRadius: '5px 5px 0 0',
            border: '1px solid #FFFFFFFF',
            padding: '4px 12px 4px 12px',
            '&:hover': {
                cursor: 'pointer',
            },
        };
    };

    const handleTabChange = (e: React.SyntheticEvent<Element>, value: any) => {
        handleClickTab(value);
    };

    return (
        // <MuiTabs
        //     variant="fullWidth"
        //     value={workingTab}
        //     onChange={handleTabChange}
        // >
        //     <Tab icon={<Person />} value = {EditorTabName.Profile} label="Profile" />
        //     <Tab icon={<Psychology />} value={EditorTabName.Mind} label="Mind" />
        //     <Tab icon={<ViewWeek />} value={EditorTabName.Combos} label="Combos" />
        //     <Tab icon={<Functions />} value={EditorTabName.Conditions} label="Conditions" />
        // </MuiTabs>

        <Box
            sx={{
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'flex-start',
            }}
        >
            <button
                onClick={(event) =>
                    handleTabChange(event, EditorTabName.Profile)
                }
                style={tabStyle(workingTab, EditorTabName.Profile)}
            >
                Profile
            </button>
            <button
                onClick={(event) => handleTabChange(event, EditorTabName.Mind)}
                style={tabStyle(workingTab, EditorTabName.Mind)}
            >
                Mind
            </button>
            <button
                onClick={(event) =>
                    handleTabChange(event, EditorTabName.Combos)
                }
                style={tabStyle(workingTab, EditorTabName.Combos)}
            >
                Combos
            </button>
            <button
                onClick={(event) =>
                    handleTabChange(event, EditorTabName.Conditions)
                }
                style={tabStyle(workingTab, EditorTabName.Conditions)}
            >
                Conditions
            </button>
        </Box>
    );
};

export default EditorTabs;
