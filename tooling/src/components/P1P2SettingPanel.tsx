import React from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import styles from "../../styles/StatusBar.module.css";
import "../../styles/StatusBar.module.css";
import { Autocomplete, TextField } from "@mui/material";
import Agent from "../types/Agent";
import { SingleMetadata } from "../types/Metadata";

interface P1P2SettingPanelProps {
    agentsFromRegistry: SingleMetadata[]
    agentChange: (whichPlayer: string, event: object, value: AgentOption) => void
}
export interface AgentOption {
    group: string;
    label: string;
    index: number;
}

const AutoComplete = styled(Autocomplete)`
  & .MuiInputBase-input {
    height: 1rem;
  }
`;


const senders = {
    "0x07ff2c85c7b1de1808ddf8897bc729feefa71ba269ea1015d1fd7a18c9918cc3" : "Greg"
}
const lookupSenderAddress = (address : string) =>{
    return senders[address] ? senders[address] : "GG"
}
const SetPlayerBar = ({ label, agentsFromRegistry, agentChange }) => {

    // ref: https://stackoverflow.com/questions/73095037/how-to-have-an-option-be-a-part-of-multiple-groups-with-mui-autocomplete
    let agentOptions = [{group:'Local', label:'new agent', index: -1}]
    agentOptions = agentOptions.concat (!agentsFromRegistry ? [] : agentsFromRegistry.map((a: SingleMetadata, a_i: number) => {
        return {
            group: 'Registry',
            label: `agent-${a_i} by ${lookupSenderAddress(a.sender)}`,
            index: a_i,
        } as AgentOption
    }))
    agentOptions = agentOptions.concat([
        {group:'Template', label:'idle agent', index: -1},
        {group:'Template', label:'defensive agent', index: -1},
        {group:'Template', label:'offensive agent', index: -1},
    ])

    return (
        <AutoComplete
            disablePortal
            id="combo-box-demo"
            options={agentOptions}
            groupBy={(option: AgentOption) => option.group}
            getOptionLabel={(option: AgentOption) => option.label}
            sx={{ width: 220 }}
            renderInput={(params) => <TextField {...params} label={label} />}
            onChange={agentChange}
        />
    )
}


const P1P2SettingPanel = ({
    agentsFromRegistry,
    agentChange
}  : P1P2SettingPanelProps) => {

    return (
        <div style={{marginBottom:'10px'}}>
            <div className={styles.statusBarRow}>
                <SetPlayerBar label={'P1'} agentsFromRegistry={agentsFromRegistry} agentChange={(event, value) => agentChange('P1', event, value)}/>
                <SetPlayerBar label={'P2'} agentsFromRegistry={agentsFromRegistry} agentChange={(event, value) => agentChange('P2', event, value)}/>
            </div>
        </div>
    );
};

export default P1P2SettingPanel;
