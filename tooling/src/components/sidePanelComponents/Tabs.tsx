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
        handleClickTab(value);
    };

    return (
        <MuiTabs
            variant="fullWidth"
            value={workingTab}
            onChange={handleTabChange}
        >
            <Tab icon={<Person />} value = {EditorTabName.Profile} label="Profile" />
            <Tab icon={<Psychology />} value={EditorTabName.Mind} label="Mind" />
            <Tab icon={<ViewWeek />} value={EditorTabName.Combos} label="Combos" />
            <Tab icon={<Functions />} value={EditorTabName.Conditions} label="Conditions" />
        </MuiTabs>
    );
};

export default Tabs;
