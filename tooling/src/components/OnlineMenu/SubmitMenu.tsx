import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Character } from '../../constants/constants';
import { useUpdateMind } from '../../../lib/api';
import { getLocalState } from '../../helpers/localState';
import OnlineTable from './OnlineTable';
import { SavedMind } from '../../types/Opponent';

interface SubmitMenuProps {
    closeMenu: () => void;
    username: string;
    minds: SavedMind[];
}

enum SubmitMenuState {
    Submitting = 'Submitting',
    SelectMind = 'SelectMind',
    Confirm = 'Confirm',
    Success = 'Success',
}

interface SubmittingProps {
    username: string;

    mind: SavedMind;
    handleLoaded: () => void;
}
const Submitting = ({ username, mind, handleLoaded }: SubmittingProps) => {
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
        <Box>
            <Typography>Submitting</Typography>
        </Box>
    );
};
const SubmitMenu = ({ closeMenu, username, minds }: SubmitMenuProps) => {
    const [state, setState] = useState<SubmitMenuState>(
        SubmitMenuState.SelectMind
    );

    const [selectedMind, selectMind] = useState<number>(-1);

    let content = null;

    const handleSubmitAgent = () => {
        setState(SubmitMenuState.Submitting);
    };

    if (state == SubmitMenuState.SelectMind) {
        content = (
            <Box>
                <Typography>Select Mind to Submit</Typography>
                <OnlineTable
                    opponents={minds}
                    selectedOpponent={selectedMind}
                    selectOpponent={selectMind}
                    displayRank={false}
                />
                <Button
                    variant={'text'}
                    onClick={() => setState(SubmitMenuState.Confirm)}
                    disabled={selectedMind === -1}
                >
                    Next
                </Button>
            </Box>
        );
    } else if (state == SubmitMenuState.Confirm) {
        content = (
            <Box>
                <Typography>Confirm</Typography>
                Submitting {minds[selectedMind].mindName}
                <Button variant={'text'} onClick={() => handleSubmitAgent()}>
                    Submit
                </Button>
            </Box>
        );
    } else if (state == SubmitMenuState.Submitting) {
        content = (
            <Submitting
                mind={minds[selectedMind]}
                username={username}
                handleLoaded={() => setState(SubmitMenuState.Success)}
            />
        );
    }
    if (state == SubmitMenuState.Success) {
        content = (
            <Box>
                <Typography>Agent Submitted</Typography>
                <Button variant={'text'} onClick={() => closeMenu()}>
                    Close
                </Button>
            </Box>
        );
    }
    return <Box>{content}</Box>;
};

export default SubmitMenu;
