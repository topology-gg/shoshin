import { Box, Paper, Tab, Tabs } from '@mui/material';
import { OnlineOpponent, SavedMind } from '../../types/Opponent';
import { useState } from 'react';
import OnlineTable from '../OnlineMenu/OnlineTable';
import { onlineOpponentAdam } from '../ChooseOpponent/opponents/Adam';
import { useListMinds } from '../../../lib/api';

interface CombinedMindListProps {
    savedMinds: SavedMind[];
    chooseMind: (mind: SavedMind | OnlineOpponent) => void;
}
const MindPreview = ({ savedMinds, chooseMind }: CombinedMindListProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedMind, selectMind] = useState<number>(-1);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        selectMind(-1);
        chooseMind(undefined);
    };

    const handleSelectMind = (mindIndex: number) => {
        selectMind(mindIndex);
        if (activeTab == 0) {
            chooseMind(shimmedMinds[mindIndex]);
        } else {
            chooseMind(onlineOpponents[mindIndex]);
        }
    };

    const shimmedMinds = [...savedMinds, onlineOpponentAdam];

    const { data: data } = useListMinds();
    const onlineOpponents = data?.onlineOpponents;

    return (
        <Box height={'100%'}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="Local" />
                <Tab label="Online" />
            </Tabs>

            {/* Tab Content */}
            {activeTab === 0 && (
                <OnlineTable
                    opponents={shimmedMinds}
                    selectedOpponent={selectedMind}
                    selectOpponent={handleSelectMind}
                />
            )}

            {activeTab === 1 && (
                <OnlineTable
                    opponents={onlineOpponents}
                    selectedOpponent={selectedMind}
                    selectOpponent={handleSelectMind}
                />
            )}
        </Box>
    );
};

export default MindPreview;
