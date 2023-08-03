import { Box } from '@mui/material';
import { OnlineOpponent, SavedMind } from '../../types/Opponent';
import { useState } from 'react';
import CombinedMindList from './CombinedMindList';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import MindPreview from './MindPreview';

interface PreviewAgainstProps {
    savedMinds: SavedMind[];
    chooseOpponent: (mindIndex: SavedMind | OnlineOpponent) => void;
    close: () => void;
}

enum PreviewAgainstStages {
    Select = 0,
    Preview = 1,
}
const PreviewAgainst = ({
    savedMinds,
    chooseOpponent,
    close,
}: PreviewAgainstProps) => {
    const [stage, setStage] = useState<PreviewAgainstStages>(
        PreviewAgainstStages.Select
    );
    const [selectedMind, selectMind] = useState<SavedMind | OnlineOpponent>();
    const handleFightClick = () => {
        chooseOpponent(selectedMind);
    };
    return (
        <Box height={'100%'} display={'flex'} flex={1} flexDirection={'column'}>
            {stage == PreviewAgainstStages.Select && (
                <Box>
                    <CombinedMindList
                        savedMinds={savedMinds}
                        chooseMind={selectMind}
                    />
                    <Box display={'flex'}>
                        <ShoshinMenuButton
                            sx={{ width: 150 }}
                            onClick={() => close()}
                        >
                            Cancel
                        </ShoshinMenuButton>
                        <ShoshinMenuButton
                            isAlt
                            sx={{ width: 175 }}
                            disabled={selectedMind === undefined}
                            onClick={() =>
                                setStage(PreviewAgainstStages.Preview)
                            }
                        >
                            Next
                        </ShoshinMenuButton>
                    </Box>
                </Box>
            )}
            {stage == PreviewAgainstStages.Preview && (
                <Box>
                    <MindPreview
                        mind={{
                            ...selectedMind,
                            createdDate: '',
                            lastUpdatedDate: '',
                        }}
                    />
                    <Box display={'flex'}>
                        <ShoshinMenuButton
                            sx={{ width: 150 }}
                            disabled={false}
                            onClick={() =>
                                setStage(PreviewAgainstStages.Select)
                            }
                        >
                            Back
                        </ShoshinMenuButton>
                        <ShoshinMenuButton
                            isAlt
                            sx={{ width: 175 }}
                            disabled={selectedMind === undefined}
                            onClick={handleFightClick}
                        >
                            Fight
                        </ShoshinMenuButton>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default PreviewAgainst;
