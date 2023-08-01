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

interface MindPreviewProps {
    mind: SavedMind;
}
const MindPreview = ({ mind }: MindPreviewProps) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Paper sx={{ height: '100%' }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="Info" />
                <Tab label="Layers" />
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
                        <strong>Layer Count:</strong> {mind.agent.layers.length}
                    </Typography>
                </Box>
            )}

            {activeTab === 1 && (
                <Box p={2}>
                    <SimpleLayerList playerAgent={mind.agent} />
                </Box>
            )}
        </Paper>
    );
};

export default MindPreview;
