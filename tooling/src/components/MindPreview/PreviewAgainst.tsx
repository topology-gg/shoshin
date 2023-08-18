import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { OnlineOpponent, SavedMind } from '../../types/Opponent';
import { useState } from 'react';
import CombinedMindList from './CombinedMindList';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import MindPreview from './MindPreview';
import { MatchFormat } from '../../constants/constants';

interface PreviewAgainstProps {
    savedMinds: SavedMind[];
    chooseOpponent: (mindIndex: SavedMind | OnlineOpponent) => void;
    previewOpen: boolean;
    close: () => void;
    selectFormat?: (format: MatchFormat) => void;
}

enum PreviewAgainstStages {
    Select = 0,
    Preview = 1,
    SelectFormat = 2,
}
const PreviewAgainstDialogue = ({
    savedMinds,
    chooseOpponent,
    close,
    selectFormat,
    previewOpen,
}: PreviewAgainstProps) => {
    const [stage, setStage] = useState<PreviewAgainstStages>(
        selectFormat !== undefined
            ? PreviewAgainstStages.SelectFormat
            : PreviewAgainstStages.Select
    );

    const [selectedMind, selectMind] = useState<SavedMind | OnlineOpponent>();
    const handleFightClick = () => {
        chooseOpponent(selectedMind);
    };

    let dialogTitle = null;

    let dialogContent = null;

    let dialogeButtons = null;

    if (stage == PreviewAgainstStages.SelectFormat) {
        dialogTitle = 'SelectFormat';

        dialogContent = (
            <Box>
                <ShoshinMenuButton>Box</ShoshinMenuButton>
            </Box>
        );
        dialogeButtons = (
            <div>
                <ShoshinMenuButton sx={{ width: 150 }} onClick={() => close()}>
                    Cancel
                </ShoshinMenuButton>
                <ShoshinMenuButton
                    isAlt
                    sx={{ width: 175 }}
                    disabled={selectedMind === undefined}
                    onClick={() => setStage(PreviewAgainstStages.Preview)}
                >
                    Next
                </ShoshinMenuButton>
            </div>
        );
    } else if (stage == PreviewAgainstStages.Select) {
        dialogTitle = 'Choose Opponent';
        dialogContent = (
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
                        onClick={() => setStage(PreviewAgainstStages.Preview)}
                    >
                        Next
                    </ShoshinMenuButton>
                </Box>
            </Box>
        );

        dialogeButtons = (
            <div>
                <ShoshinMenuButton sx={{ width: 150 }} onClick={() => close()}>
                    Cancel
                </ShoshinMenuButton>
                <ShoshinMenuButton
                    isAlt
                    sx={{ width: 175 }}
                    disabled={selectedMind === undefined}
                    onClick={() => setStage(PreviewAgainstStages.Preview)}
                >
                    Next
                </ShoshinMenuButton>
            </div>
        );
    } else if (stage == PreviewAgainstStages.Preview) {
        dialogContent = (
            <MindPreview
                mind={{
                    ...selectedMind,
                    createdDate: '',
                    lastUpdatedDate: '',
                }}
            />
        );

        dialogeButtons = (
            <div>
                <ShoshinMenuButton
                    sx={{ width: 150 }}
                    disabled={false}
                    onClick={() => setStage(PreviewAgainstStages.Select)}
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
            </div>
        );
    }

    return (
        <Dialog
            open={previewOpen}
            onClose={close}
            fullWidth={true}
            maxWidth={'lg'}
        >
            <DialogTitle>{dialogTitle}</DialogTitle>

            <DialogContent>{dialogContent}</DialogContent>

            <DialogActions>{dialogeButtons}</DialogActions>
        </Dialog>
    );
};

export default PreviewAgainstDialogue;
