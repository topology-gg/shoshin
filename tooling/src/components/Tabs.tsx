import * as React from "react";
import { Tab, Tabs as MuiTabs } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import FunctionsIcon from "@mui/icons-material/Functions";
import { SportsMartialArts } from "@mui/icons-material";

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
            <Tab icon={<PsychologyAltIcon />} value={0} label="Mental States" />
            <Tab icon={<PsychologyIcon />} value={1} label="Combos" />
            <Tab icon={<FunctionsIcon />} value={2} label="Functions" />
            <Tab icon={<SportsMartialArts />} value={3} label="Opponent" />
        </MuiTabs>
    );
};

export default Tabs;
