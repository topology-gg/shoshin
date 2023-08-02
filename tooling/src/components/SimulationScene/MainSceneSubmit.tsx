import { useEffect, useState } from 'react';
import { SavedMind } from '../../types/Opponent';
import { useUpdateMind } from '../../../lib/api';
import { Button, CircularProgress } from '@mui/material';

interface SubmitButtonProps {
    mind: SavedMind;
    username: String;
}

interface SubmittingProps extends SubmitButtonProps {
    handleLoaded: () => void;
}
const Submitting = ({ mind, username, handleLoaded }: SubmittingProps) => {
    const characterName = mind.agent.character.toLowerCase();

    const res = useUpdateMind(
        username,
        characterName,
        mind.mindName,
        mind.agent
    );

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

const SubmitMindButton = ({ mind, username }: SubmitButtonProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <Button
            variant="outlined"
            disabled={loading}
            onClick={() => setLoading(true)}
        >
            {!loading ? (
                'Submit'
            ) : (
                <Submitting
                    mind={mind}
                    username={username}
                    handleLoaded={() => setLoading(false)}
                />
            )}
        </Button>
    );
};

export default SubmitMindButton;
