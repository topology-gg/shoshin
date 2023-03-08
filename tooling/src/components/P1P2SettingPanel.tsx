import React from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import styles from "../../styles/StatusBar.module.css";
import "../../styles/StatusBar.module.css";
import { Autocomplete, TextField } from "@mui/material";

interface P1P2SettingPanelProps {
}

const AutoComplete = styled(Autocomplete)`
  & .MuiInputBase-input {
    height: 1rem;
  }
`;

const SetPlayerBar = ({ label }) => {
    const OPTIONS = ['a','b','c']
    return (
        <AutoComplete
            disablePortal
            id="combo-box-demo"
            options={OPTIONS}
            sx={{ width: 120 }}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    )
}


const P1P2SettingPanel = ({} : P1P2SettingPanelProps) => {

    return (
        <div style={{marginBottom:'10px'}}>
            <div className={styles.statusBarRow}>
                <SetPlayerBar label={'P1'}/>
                <SetPlayerBar label={'P2'}/>
            </div>
        </div>
    );
};

export default P1P2SettingPanel;
