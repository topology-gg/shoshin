import React from "react";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import "../../../styles/StatusBar.module.css";
import { Autocomplete, TextField } from "@mui/material";
import Agent from "../../types/Agent";
import { SingleMetadata } from "../../types/Metadata";

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
    "0x07ff2c85c7b1de1808ddf8897bc729feefa71ba269ea1015d1fd7a18c9918cc3" : "Greg",
    "0x0266ed55be7054c74db3f8ec2e79c728056c802a11481fad0e91220139b8916a" : "NonCents",
    "0x02f880133db4f533bdbc10c3d02fbc9b264dac2ff52eae4e0cec0ce794bad898" : "GG",
    "0x01b0afcd626d197993070994f8b37d20594c93bebfd48e28bd38c3b94a5802ea" : "GG-Cartridge"
}
const lookupSenderAddress = (address : string) =>{
    return senders[address] ? senders[address] : "anon"
}



export const SetPlayerBar = ({ label, agentsFromRegistry, agentChange }) => {

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

export const SelectCharacterBar = ({ label, changeCharacter }) => {

    const characterOptions = [
        {label : "jessica", id: 0},
        {label : 'antoc', id : 1}
    ]
    return (
        <AutoComplete
            disablePortal
            id="combo-box-demo"
            options={characterOptions}
            sx={{ width: 220 }}
            renderInput={(params) => <TextField {...params} label={label} />}
            onChange={changeCharacter}
        />
    )
}
