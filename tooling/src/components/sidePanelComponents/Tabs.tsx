import * as React from "react";
import { Tab, Tabs as MuiTabs } from "@mui/material";
import { SportsMartialArts, SelfImprovement, PsychologyAlt, Psychology, Functions, ViewWeek, Person } from "@mui/icons-material";

// export enum for tab names
export enum EditorTabName {
    Profile = 'Profile',
    Mind = 'Mind',
    Combos = 'Combos',
    Conditions = 'Conditions'
}

const Tabs = ({ workingTab, handleClickTab }) => {

    const handleTabChange = (e: React.SyntheticEvent<Element>, value: any) => {
        if (value == 0) {
            handleClickTab(EditorTabName.Profile);
        }
        else if (value == 1) {
            handleClickTab(EditorTabName.Mind);
        }
        else if (value == 2) {
            handleClickTab(EditorTabName.Combos);
        }
        else if (value == 3) {
            handleClickTab(EditorTabName.Conditions);
        }
    };

    return (
        <MuiTabs
            variant="fullWidth"
            value={workingTab}
            onChange={handleTabChange}
        >
            <Tab icon={<Person />} value = {0} label="Profile" />
            <Tab icon={<Psychology />} value={1} label="Mind" />
            <Tab icon={<ViewWeek />} value={2} label="Combos" />
            <Tab icon={<Functions />} value={3} label="Conditions" />
        </MuiTabs>
    );
};

export default Tabs;
