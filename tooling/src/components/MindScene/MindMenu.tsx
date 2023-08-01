import React, { ForwardedRef, useState } from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from '@mui/material';
import OnlineTable from '../OnlineMenu/OnlineTable';
import FullArtBackground from '../layout/FullArtBackground';
import { OnlineOpponent, SavedMind } from '../../types/Opponent';
import MindPreview from '../MindPreview/MindPreview';
import { onlineOpponentAdam } from '../ChooseOpponent/opponents/Adam';
import PreviewAgainst from '../MindPreview/PreviewAgainst';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';

interface MindMenuProps {
    minds: SavedMind[];
    transitionBack: () => void;
    transitionToPreview: (
        preview: SavedMind,
        opponent: SavedMind | OnlineOpponent
    ) => void;
    saveMinds: (minds: SavedMind[]) => void;
}

const MindMenu = React.forwardRef<HTMLDivElement, MindMenuProps>(
    ({ minds, transitionToPreview, saveMinds, transitionBack }, ref) => {
        const [selectedMind, selectMind] = useState<number>(-1);

        const [previewOpen, setPreviewOpen] = useState<boolean>(false);

        const handleChooseOpponent = (opponent: SavedMind | OnlineOpponent) => {
            transitionToPreview(minds[selectedMind], opponent);
        };

        const handleDuplicatClick = () => {
            saveMinds([
                ...minds,
                {
                    ...minds[selectedMind],
                    mindName: minds[selectedMind].mindName + ' copy',
                },
            ]);
        };

        const handleDeleteClick = () => {
            let mindsCopy = [...minds];

            mindsCopy.splice(selectedMind, 1);

            saveMinds(mindsCopy);
        };
        return (
            <div ref={ref}>
                <FullArtBackground useAlt={true}>
                    <Typography variant="h2">Minds</Typography>
                    <Dialog
                        open={previewOpen}
                        onClose={() => setPreviewOpen(false)}
                        fullWidth={true}
                        maxWidth={'lg'}
                    >
                        <DialogTitle>Choose an opponent</DialogTitle>
                        <DialogContent>
                            <PreviewAgainst
                                savedMinds={minds}
                                chooseOpponent={handleChooseOpponent}
                                close={() => setPreviewOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    <Grid container sx={{ width: '66%', height: '50%' }}>
                        <Grid item xs={4}>
                            <Box maxHeight={'60vh'} width={'100%'}>
                                <OnlineTable
                                    opponents={minds}
                                    selectedOpponent={selectedMind}
                                    selectOpponent={selectMind}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={8} sx={{ height: '100%', flex: 1 }}>
                            {selectedMind !== -1 && (
                                <Box sx={{ height: '100%' }}>
                                    <MindPreview
                                        mind={{
                                            ...minds[selectedMind],
                                            createdDate: '',
                                            lastUpdatedDate: '',
                                        }}
                                    />
                                    <Box>
                                        <Button
                                            onClick={() => setPreviewOpen(true)}
                                        >
                                            Preview
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleDuplicatClick()
                                            }
                                        >
                                            Duplicate
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteClick()}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Grid>

                        <Grid item xs={4}>
                            <ShoshinMenuButton
                                sx={{ width: 150 }}
                                disabled={false}
                                onClick={() => transitionBack()}
                            >
                                Back
                            </ShoshinMenuButton>
                        </Grid>
                    </Grid>
                </FullArtBackground>
            </div>
        );
    }
);

export default MindMenu;
