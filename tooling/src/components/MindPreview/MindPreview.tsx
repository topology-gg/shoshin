import React, { useState } from 'react';
import {
    Tabs,
    Tab,
    Typography,
    Box,
    Paper,
    Button,
    Divider,
} from '@mui/material';
import { OnlineOpponent, SavedMind } from '../../types/Opponent';
import SimpleLayerList from '../sidePanelComponents/Gambit/SimpleLayerList';
import { useGetMind } from '../../../lib/api';
import MatchHistory from './MatchHistory';

interface MindPreviewProps {
    mind: SavedMind;
}
const MindPreview = ({ mind }: MindPreviewProps) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const onlineMind = useGetMind(
        mind.playerName,
        mind.agent.character,
        mind.mindName
    );

    const isOnline = onlineMind.error ? false : true;
    return (
        <Paper sx={{ height: '100%' }}>
            <Box height={'100%'} display={'flex'} flexDirection={'column'}>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label="Info" />
                    <Tab label="Layers" />
                    {isOnline && <Tab label="Match History" />}
                </Tabs>

                {/* Tab Content */}
                {activeTab === 0 && (
                    <Box p={2}>
                        <Typography variant="h6">Mind Info</Typography>
                        <Typography>Mind Name: {mind.mindName}</Typography>
                        <Typography>
                            <strong>Author Name: {mind.playerName}</strong>
                        </Typography>
                        <Typography>
                            <strong>Layer Count:</strong>{' '}
                            {mind.agent.layers.length}
                        </Typography>
                        <Typography>
                            <strong>Online</strong> : {isOnline ? 'Yes' : 'No'}
                        </Typography>
                        {isOnline && (
                            <Typography>
                                <strong>Rank</strong> : {mind.rank}
                            </Typography>
                        )}
                    </Box>
                )}

                {activeTab === 1 && (
                    <Box p={2} overflow={'auto'} height={'100%'}>
                        <SimpleLayerList playerAgent={mind.agent} />
                    </Box>
                )}

                {activeTab === 2 && (
                    <Box p={2} overflow={'auto'} height={'100%'}>
                        <MatchHistory records={mind.records} />
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default MindPreview;
