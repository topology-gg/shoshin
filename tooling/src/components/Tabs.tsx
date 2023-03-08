import * as React from "react";
import { Tab, Tabs as MuiTabs } from "@mui/material";
import { SportsMartialArts, SelfImprovement, PsychologyAlt, Psychology, Functions } from "@mui/icons-material";

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
            <Tab icon={<PsychologyAlt />} value={0} label="Mental States" />
            <Tab icon={<Psychology />} value={1} label="Combos" />
            <Tab icon={<Functions />} value={2} label="Functions" />
            {/* <Tab icon={<SportsMartialArts />} value={3} label="Opponent" /> */}
            {/* <Tab icon={<SelfImprovement />} value={4} label="Set Fighters" /> */}
        </MuiTabs>
    );
};

export default Tabs;
