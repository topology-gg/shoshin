import { useEffect, useState } from 'react';
import { SavedMind } from '../../../types/Opponent';
import { useUpdateMind } from '../../../../lib/api';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
} from '@mui/material';

interface SubmitButtonProps {
    mind: SavedMind;
    username: String;
}

interface SubmittingProps extends SubmitButtonProps {
    handleLoaded: () => void;
    newMindName: string;
    newAuthorName: string;
}
export const SubmittingOnline = ({
    mind,
    username,
    handleLoaded,
    newMindName,
    newAuthorName,
}: SubmittingProps) => {
    const characterName = mind.agent.character.toLowerCase();
    const authorName = newAuthorName.length > 0 ? newAuthorName : username;
    const mindName = newMindName.length > 0 ? newMindName : mind.mindName;

    const res = useUpdateMind(authorName, characterName, mindName, mind.agent);

    useEffect(() => {
        if (res) {
            handleLoaded();
        }
    }, [res]);
    return (
        <Button>
            <CircularProgress size={24} />
        </Button>
    );
};

export const OnlineSubmitButtonDialogContent = ({
    newMindName,
    setNewMindName,
    newAuthorName,
    setNewAuthorName,
}) => {
    return (
        <div>
            <DialogTitle>Agent name?</DialogTitle>
            <DialogContent>
                <input
                    autoFocus
                    type="text"
                    id="name"
                    placeholder={newMindName}
                    style={{ width: '100%', marginTop: '1rem' }}
                    value={newMindName}
                    onChange={(event) => setNewMindName(event.target.value)}
                />
            </DialogContent>
            <DialogTitle>Author name?</DialogTitle>
            <DialogContent>
                <input
                    autoFocus
                    type="text"
                    id="name"
                    placeholder={newAuthorName}
                    style={{ width: '100%', marginTop: '1rem' }}
                    value={newAuthorName}
                    onChange={(event) => setNewAuthorName(event.target.value)}
                />
            </DialogContent>
        </div>
    );
};

const SubmitMindButton = ({ mind, username }: SubmitButtonProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [namingOpen, setNamingOpen] = useState<boolean>(false);
    const [newMindName, setNewMindName] = useState<string>('');
    const [newAuthorName, setNewAuthorName] = useState<string>('');

    return (
        <Tooltip title={'Submit to fight against other players'}>
            <div>
                <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={() => setNamingOpen(true)}
                >
                    {!loading ? (
                        'Submit'
                    ) : (
                        <SubmittingOnline
                            mind={mind}
                            username={username}
                            handleLoaded={() => setLoading(false)}
                            newMindName={newMindName}
                            newAuthorName={newAuthorName}
                        />
                    )}
                </Button>

                <Dialog open={namingOpen} onClose={() => setNamingOpen(false)}>
                    <OnlineSubmitButtonDialogContent
                        newMindName={newMindName}
                        setNewMindName={setNewMindName}
                        newAuthorName={newAuthorName}
                        setNewAuthorName={setNewAuthorName}
                    />
                    <DialogActions>
                        <Button
                            onClick={() => setNamingOpen(false)}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setLoading(true);
                                setNamingOpen(false);
                            }}
                            color="primary"
                            variant="contained"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Tooltip>
    );
};

export default SubmitMindButton;
