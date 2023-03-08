import React from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import styles from "../../styles/StatusBar.module.css";
import "../../styles/StatusBar.module.css";
import { Autocomplete, TextField } from "@mui/material";
import Agent from "../types/Agent";

interface P1P2SettingPanelProps {
    agentsFromRegistry: Agent[]
}
interface AgentOption {
    group: string;
    label: string;
}

const AutoComplete = styled(Autocomplete)`
  & .MuiInputBase-input {
    height: 1rem;
  }
`;

const SetPlayerBar = ({ label, agentsFromRegistry }) => {

    // ref: https://stackoverflow.com/questions/73095037/how-to-have-an-option-be-a-part-of-multiple-groups-with-mui-autocomplete
    let agentOptions = [{group:'Local', label:'new agent'}]
    agentOptions = agentOptions.concat (!agentsFromRegistry ? [] : agentsFromRegistry.map((a: Agent, a_i: number) => {
        return {
            group: 'Registry',
            label: `agent-${a_i}`,
        } as AgentOption
    }))
    agentOptions = agentOptions.concat([
        {group:'Template', label:'idle agent'},
        {group:'Template', label:'defensive agent'},
        {group:'Template', label:'offensive agent'},
    ])

    return (
        <AutoComplete
            disablePortal
            id="combo-box-demo"
            options={agentOptions}
            groupBy={(option: AgentOption) => option.group}
            getOptionLabel={(option: AgentOption) => option.label}
            sx={{ width: 160 }}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    )
}


const P1P2SettingPanel = ({ agentsFromRegistry}  : P1P2SettingPanelProps) => {

    return (
        <div style={{marginBottom:'10px'}}>
            <div className={styles.statusBarRow}>
                <SetPlayerBar label={'P1'} agentsFromRegistry={agentsFromRegistry} />
                <SetPlayerBar label={'P2'} agentsFromRegistry={agentsFromRegistry} />
            </div>
        </div>
    );
};

export default P1P2SettingPanel;
