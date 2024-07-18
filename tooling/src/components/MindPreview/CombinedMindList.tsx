import { Box, Paper, Tab, Tabs } from '@mui/material';
import {
    EMPTY_SAVED_MINDS,
    OnlineOpponent,
    SavedMind,
} from '../../types/Opponent';
import { useState } from 'react';
import OnlineTable from '../OnlineMenu/OnlineTable';
import { onlineOpponentAdam } from '../ChooseOpponent/opponents/Adam';
import { useListMinds } from '../../../lib/api';
import { PlayerAgent } from '../../types/Agent';
import { Character } from '../../constants/constants';

interface CombinedMindListProps {
    savedMinds: SavedMind[];
    chooseMind: (mind: SavedMind | OnlineOpponent) => void;
}
const MindPreview = ({ savedMinds, chooseMind }: CombinedMindListProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedMind, selectMind] = useState<number>(-1);

    const localMinds = savedMinds.concat(EMPTY_SAVED_MINDS);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        selectMind(-1);
        chooseMind(undefined);
    };

    const handleSelectMind = (mindIndex: number) => {
        selectMind(mindIndex);
        if (activeTab == 0) {
            chooseMind(localMinds[mindIndex]);
        } else {
            chooseMind(onlineOpponents[mindIndex]);
        }
    };

    const { data: data } = useListMinds(undefined, undefined);
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
                    opponents={localMinds}
                    selectedOpponent={selectedMind}
                    selectOpponent={handleSelectMind}
                    displayRank={false}
                />
            )}

            {activeTab === 1 && (
                <OnlineTable
                    opponents={onlineOpponents}
                    selectedOpponent={selectedMind}
                    selectOpponent={handleSelectMind}
                    displayRank={false}
                />
            )}
        </Box>
    );
};

export default MindPreview;
