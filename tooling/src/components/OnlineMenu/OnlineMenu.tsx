import React, { useEffect, useState } from 'react';
import FullArtBackground from '../layout/FullArtBackground';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import OnlineTable from './OnlineTable';
import { JessicaOpponents } from '../ChooseOpponent/opponents/opponents';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import SubmitMenu from './SubmitMenu';
import { useListMinds } from '../../../lib/api';
import { OnlineOpponent, SavedMind } from '../../types/Opponent';
import MindPreview from '../MindPreview/MindPreview';
import PreviewAgainst from '../MindPreview/PreviewAgainst';
import PreviewAgainstDialogue from '../MindPreview/PreviewAgainst';
import { MatchFormat } from '../../constants/constants';
import { SearchBar, SearchType } from './Search';

interface OnlineMenuProps {
    transitionBack: () => void;
    transitionFromOnlineMenu: (
        playerMind: SavedMind | OnlineOpponent,
        opp: OnlineOpponent,
        isSpectate: boolean
    ) => void;
    savedMinds: SavedMind[];
    saveMinds: (minds: SavedMind[]) => void;
}
const OnlineMenu = React.forwardRef<HTMLDivElement, OnlineMenuProps>(
    (
        { transitionBack, transitionFromOnlineMenu, savedMinds, saveMinds },
        ref
    ) => {
        const [selectedOpponent, selectOpponent] = useState<number>(-1);

        const [searchTerm, setSearchTerm] = useState<string>('');
        const [searchType, setSearchType] = useState<SearchType>(
            SearchType.MindName
        );

        const { data: data } = useListMinds(searchType, searchTerm);
        const onlineOpponents = data?.onlineOpponents;

        const handleChooseMind = (mind: SavedMind | OnlineOpponent) => {
            if (onlineOpponents === undefined) {
                return;
            }
            setOpenChooseMind(false);
            transitionFromOnlineMenu(
                mind,
                onlineOpponents[selectedOpponent],
                false
            );
        };

        const handleChooseSpectate = (mind: SavedMind | OnlineOpponent) => {
            if (onlineOpponents === undefined) {
                return;
            }
            setOpenChooseSpectate(false);
            transitionFromOnlineMenu(
                mind,
                onlineOpponents[selectedOpponent],
                true
            );
        };

        const [previewOpen, setPreviewOpen] = useState<boolean>(false);
        const [openChooseMind, setOpenChooseMind] = useState<boolean>(false);
        const [openChooseSpectate, setOpenChooseSpectate] =
            useState<boolean>(false);

        const [format, selectFormat] = useState<MatchFormat>(
            MatchFormat.SINGLE
        );

        const handleAddToSavedMinds = () => {
            saveMinds([
                ...savedMinds,
                {
                    ...onlineOpponents[selectedOpponent],
                    createdDate: Date.now(),
                    lastUpdatedDate: Date.now(),
                },
            ]);
        };

        const [isSubmitOpeoned, setOpenSubmit] = useState<boolean>(false);

        const toggleMenu = () => {
            setOpenSubmit(!isSubmitOpeoned);
        };
        const handleCardClick = (event) => {
            // Prevent the click event from propagating to the parent elements
            event.stopPropagation();
        };

        const persistedUsername = localStorage.getItem('username');
        const [usernameDialogueOpen, setOpen] = React.useState(
            persistedUsername === null
        );

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        const handleSave = () => {
            localStorage.setItem('username', username);
            handleClose();
        };

        const [username, setUsername] = useState('');
        useEffect(() => {
            const username = localStorage.getItem('username');
            if (username !== null) {
                setUsername(username);
            }
        }, []);
        const handleInputChange = (e) => {
            setUsername(e.target.value);
        };

        const handleSearch = (searchType: SearchType, searchTerm: string) => {
            selectOpponent(-1);
            setSearchType(searchType);
            setSearchTerm(searchTerm);
        };

        const mindAlreadySaved =
            selectedOpponent !== -1
                ? savedMinds.find(
                      (mind) =>
                          mind.mindName ===
                          onlineOpponents[selectedOpponent].mindName
                  ) !== undefined
                : false;

        const selectedOnlineOpponent =
            selectedOpponent >= 0 && onlineOpponents !== undefined
                ? onlineOpponents[selectedOpponent]
                : undefined;
        return (
            <div ref={ref}>
                <FullArtBackground useAlt={true}>
                    <Dialog open={usernameDialogueOpen} onClose={handleClose}>
                        <DialogTitle>Welcome</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To play online, please enter a username.
                            </DialogContentText>
                            <input
                                autoFocus
                                type="text"
                                id="name"
                                placeholder="Username"
                                style={{ width: '100%', marginTop: '1rem' }}
                                value={username}
                                onChange={handleInputChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleSave}>Submit</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={previewOpen}
                        onClose={() => setPreviewOpen(false)}
                        fullWidth={true}
                        maxWidth={'lg'}
                    >
                        <DialogTitle>
                            Preview {selectedOnlineOpponent?.mindName} by{' '}
                            {selectedOnlineOpponent?.playerName}
                        </DialogTitle>
                        <DialogContent>
                            <MindPreview
                                mind={{
                                    ...selectedOnlineOpponent,
                                    createdDate: '',
                                    lastUpdatedDate: '',
                                }}
                            />
                        </DialogContent>
                    </Dialog>

                    <PreviewAgainstDialogue
                        savedMinds={savedMinds}
                        chooseOpponent={handleChooseMind}
                        close={() => setOpenChooseMind(false)}
                        previewOpen={openChooseMind}
                    />

                    <PreviewAgainstDialogue
                        savedMinds={savedMinds}
                        chooseOpponent={handleChooseSpectate}
                        close={() => setOpenChooseSpectate(false)}
                        previewOpen={openChooseSpectate}
                        selectFormat={selectFormat}
                    />

                    {isSubmitOpeoned && (
                        <div className={'overlay-menu'} onClick={toggleMenu}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Card onClick={handleCardClick}>
                                    <CardContent>
                                        <SubmitMenu
                                            closeMenu={toggleMenu}
                                            username={username}
                                            minds={savedMinds}
                                        />
                                    </CardContent>
                                </Card>
                            </Box>
                        </div>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '60%',
                            height: '100vh',
                        }}
                    >
                        <Typography variant="h3" gutterBottom>
                            Online Opponents
                        </Typography>
                        <SearchBar onSearch={handleSearch} />
                        <Box
                            maxHeight={'60vh'}
                            minHeight={'60vh'}
                            width={'100%'}
                            sx={{ overflowY: 'auto', marginBottom: '16px' }}
                        >
                            <OnlineTable
                                displayRank={true}
                                opponents={onlineOpponents}
                                selectedOpponent={selectedOpponent}
                                selectOpponent={selectOpponent}
                            />
                        </Box>
                        <Button variant={'text'} onClick={toggleMenu}>
                            <Typography variant={'h6'}>
                                + Submit Mind
                            </Typography>
                        </Button>
                    </Box>
                    <Button variant="text" onClick={() => handleClickOpen()}>
                        username: {username}
                    </Button>
                    <Grid container>
                        <Grid item xs={7} />
                        <Grid item xs={5}>
                            <Box display={'flex'}>
                                <ShoshinMenuButton
                                    sx={{ width: 150 }}
                                    onClick={transitionBack}
                                >
                                    Back
                                </ShoshinMenuButton>

                                <ShoshinMenuButton
                                    sx={{ width: 175 }}
                                    onClick={handleAddToSavedMinds}
                                    disabled={
                                        mindAlreadySaved ||
                                        selectedOpponent === -1
                                    }
                                >
                                    Add to minds
                                </ShoshinMenuButton>

                                <ShoshinMenuButton
                                    sx={{ width: 200 }}
                                    onClick={() => setPreviewOpen(true)}
                                    disabled={selectedOpponent === -1}
                                >
                                    Preview
                                </ShoshinMenuButton>

                                <ShoshinMenuButton
                                    sx={{ width: 200 }}
                                    onClick={() => setOpenChooseSpectate(true)}
                                    disabled={selectedOpponent === -1}
                                >
                                    Spectate
                                </ShoshinMenuButton>

                                <ShoshinMenuButton
                                    isAlt
                                    sx={{ width: 175 }}
                                    onClick={() => setOpenChooseMind(true)}
                                    disabled={selectedOpponent === -1}
                                >
                                    Fight
                                </ShoshinMenuButton>
                            </Box>
                        </Grid>
                    </Grid>
                </FullArtBackground>
            </div>
        );
    }
);

export default OnlineMenu;
