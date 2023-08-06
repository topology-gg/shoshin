import React, { ForwardedRef, useState } from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from '@mui/material';
import OnlineTable from '../OnlineMenu/OnlineTable';
import FullArtBackground from '../layout/FullArtBackground';
import {
    EMPTY_SAVED_MINDS,
    OnlineOpponent,
    SavedMind,
} from '../../types/Opponent';
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

        const [renameOpen, setRenameOpen] = useState<boolean>(false);
        const [newMindName, setNewMindName] = useState<string>('');

        const ExtendedMinds: SavedMind[] = minds.concat(EMPTY_SAVED_MINDS);

        const handleMindNameChange = (event) => {
            setNewMindName(event.target.value);
        };

        const handleRenameClick = () => {
            setNewMindName(minds[selectedMind].mindName);
            setRenameOpen(true);
        };

        const handleRenameConfirm = () => {
            let mindsCopy = [...minds];

            mindsCopy[selectedMind].mindName = newMindName;

            saveMinds(mindsCopy);
            setRenameOpen(false);
        };

        const handleChooseOpponent = (opponent: SavedMind | OnlineOpponent) => {
            transitionToPreview(ExtendedMinds[selectedMind], opponent);
        };

        // const copyExists = minds.some((mind) => {
        //     if (selectedMind === -1) return false;
        //     return minds[selectedMind].mindName + ' copy' === mind.mindName;
        // });
        const copyExistsInExtended = ExtendedMinds.some((mind) => {
            if (selectedMind === -1) return false;
            return (
                ExtendedMinds[selectedMind].mindName + ' copy' === mind.mindName
            );
        });

        const handleDuplicateClick = () => {
            saveMinds([
                ...minds,
                {
                    ...ExtendedMinds[selectedMind],
                    mindName: ExtendedMinds[selectedMind].mindName + ' copy',
                    playerName: '-',
                },
            ]);
        };

        const handleDeleteClick = () => {
            let mindsCopy = [...minds];

            mindsCopy.splice(selectedMind, 1);

            if (selectedMind >= minds.length - 2) {
                selectMind(minds.length - 2);
            }

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
                    <Dialog
                        open={renameOpen}
                        onClose={() => setRenameOpen(false)}
                    >
                        <DialogTitle>Input a new name</DialogTitle>
                        <DialogContent>
                            <input
                                autoFocus
                                type="text"
                                id="name"
                                placeholder="Mind Name"
                                style={{ width: '100%', marginTop: '1rem' }}
                                value={newMindName}
                                onChange={handleMindNameChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setRenameOpen(false)}
                                color="primary"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRenameConfirm}
                                color="primary"
                                variant="contained"
                            >
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Grid
                        container
                        sx={{ width: '66%', height: '70%' }}
                        spacing={2}
                    >
                        <Grid item xs={4} sx={{ height: '100%' }}>
                            <Box height={'100%'} width={'100%'} overflow="auto">
                                <OnlineTable
                                    opponents={ExtendedMinds}
                                    selectedOpponent={selectedMind}
                                    selectOpponent={selectMind}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={8} sx={{ height: '100%' }}>
                            {selectedMind !== -1 && (
                                <Box sx={{ height: '100%' }}>
                                    <MindPreview
                                        mind={ExtendedMinds[selectedMind]}
                                    />
                                    <Box>
                                        <Button
                                            disabled={
                                                ExtendedMinds[selectedMind]
                                                    .playerName == 'SYSTEM'
                                            }
                                            onClick={() => setPreviewOpen(true)}
                                        >
                                            Use this Mind to Fight
                                        </Button>
                                        <Button
                                            disabled={
                                                ExtendedMinds[selectedMind]
                                                    .playerName == 'SYSTEM'
                                            }
                                            onClick={handleRenameClick}
                                        >
                                            Rename
                                        </Button>
                                        <Button
                                            disabled={copyExistsInExtended}
                                            onClick={() =>
                                                handleDuplicateClick()
                                            }
                                        >
                                            Duplicate
                                        </Button>
                                        <Button
                                            disabled={
                                                ExtendedMinds[selectedMind]
                                                    .playerName == 'SYSTEM'
                                            }
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
