import React from 'react';
import '../../../styles/StatusBar.module.css';
import {
    Box,
    FormControl,
    InputLabel,
    ListSubheader,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { SingleMetadata } from '../../types/Metadata';
import BlurrableSelect from '../ui/BlurrableSelect';

export interface AgentOption {
    group: string;
    label: string;
    index: number;
}

const senders = {
    '0x07ff2c85c7b1de1808ddf8897bc729feefa71ba269ea1015d1fd7a18c9918cc3':
        'Greg',
    '0x0266ed55be7054c74db3f8ec2e79c728056c802a11481fad0e91220139b8916a':
        'NonCents',
    '0x02f880133db4f533bdbc10c3d02fbc9b264dac2ff52eae4e0cec0ce794bad898': 'GG',
    '0x01b0afcd626d197993070994f8b37d20594c93bebfd48e28bd38c3b94a5802ea':
        'GG-Cartridge',
};
const lookupSenderAddress = (address: string) => {
    return senders[address] ? senders[address] : 'anon';
};

const createMenuItem = (index: number, group: string, label: string) => {
    return (
        <MenuItem
            value={JSON.stringify({
                index: index,
                group: group,
                label: label,
            })}
        >
            {label}
        </MenuItem>
    );
};
export const SetPlayerBar = ({
    label,
    agentsFromRegistry,
    leagueAgents,
    agentChange,
}) => {
    // ref: https://stackoverflow.com/questions/73095037/how-to-have-an-option-be-a-part-of-multiple-groups-with-mui-autocomplete
    let yourAgent = createMenuItem(-1, null, 'your agent');

    const trainingAgents = [
        createMenuItem(-1, 'Training', 'idle agent'),
        createMenuItem(-1, 'Training', 'offensive agent'),
        createMenuItem(-1, 'Training', 'defensive agent'),
    ];

    const leagueAgentOptions = !leagueAgents
        ? []
        : leagueAgents.map((a: any, a_i: number) => {
              return createMenuItem(
                  a_i,
                  'League',
                  `${a.agent_name} by ${lookupSenderAddress(a.sender)}`
              );
          });

    const registryAgents = !agentsFromRegistry
        ? []
        : agentsFromRegistry.map((a: SingleMetadata, a_i: number) => {
              return createMenuItem(
                  a_i,
                  'Registry',
                  `agent-${a_i} by ${lookupSenderAddress(a.sender)}`
              );
          });

    const handleChange = (event: SelectChangeEvent, value: string) => {
        agentChange(JSON.parse(event.target.value));
    };

    return (
        <Box width={'200px'}>
            <FormControl fullWidth>
                <InputLabel id="select label">{label}</InputLabel>
                <BlurrableSelect id="agent-select" onChange={handleChange}>
                    <ListSubheader>Local</ListSubheader>
                    {yourAgent}
                    <ListSubheader>Training</ListSubheader>
                    {trainingAgents}
                    <ListSubheader>League</ListSubheader>
                    {leagueAgentOptions}
                    <ListSubheader>Registry</ListSubheader>
                    {registryAgents}
                </BlurrableSelect>
            </FormControl>
        </Box>
    );
};

export const SelectCharacterBar = ({ label, changeCharacter }) => {
    const handleChange = (event: SelectChangeEvent) => {
        changeCharacter(event.target.value);
    };

    return (
        <Box width={'200px'}>
            <FormControl fullWidth>
                <InputLabel id="select label">{label}</InputLabel>
                <BlurrableSelect
                    id="agent-select"
                    onChange={handleChange}
                    defaultValue=""
                >
                    <MenuItem value={0}>jessica</MenuItem>
                    <MenuItem value={1}>antoc</MenuItem>
                </BlurrableSelect>
            </FormControl>
        </Box>
    );
};
