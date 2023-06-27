import React, { useRef } from 'react';
import { Typography, Box } from '@mui/material';
import styles from './ChooseOpponent.module.css';
import { useAgents, useLeagueAgents } from '../../../lib/api';
import { SingleMetadata, splitSingleMetadata } from '../../types/Metadata';
import Agent from '../../types/Agent';

const ChooseOpponent = ({ transitionMainScene }) => {
    // Retrieve the last 20 agents submissions from the db
    const { data: data } = useAgents();
    const t: SingleMetadata[] = data?.agents;
    const agents: Agent[] = t?.map(splitSingleMetadata).flat();

    const { data: leagueData } = useLeagueAgents();

    let leagueAgents: Agent[] = leagueData?.agents
        ?.map(splitSingleMetadata)
        .flat();

    let characterBoxes = [];
    if (agents !== undefined && leagueAgents !== undefined) {
        characterBoxes = [...agents, ...leagueAgents].map((agent, index) => {
            const handleClick = () => {
                transitionMainScene(agent);
            };

            const imageUrl =
                'images/' +
                (agent.character == 0 ? 'jessica' : 'antoc') +
                '/idle/right/frame_0.png';
            const characterName = agent.character == 0 ? 'Jessica' : 'Antoc';
            return (
                <Box
                    key={index}
                    className={styles.characterBox}
                    onClick={handleClick}
                >
                    <Typography variant="h4">{characterName}</Typography>
                    <img src={imageUrl} alt="Image 1" height="200px" />
                    <Typography variant="body2">
                        Additional descriptive text
                    </Typography>
                </Box>
            );
        });
    }
    return <div className={styles.characterGrid}>{characterBoxes}</div>;
};

export default ChooseOpponent;
