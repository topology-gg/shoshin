import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Character } from '../../constants/constants';
import { useUpdateMind } from '../../../lib/api';
import { getLocalState } from '../../helpers/localState';

interface SubmitMenuProps {
    closeMenu: () => void;
    username: string;
}

enum SubmitMenuState {
    Submitting = 'Submitting',
    SelectCharacter = 'SelectCharacter',
    NameMind = 'NameMind',
    Success = 'Success',
}

interface SubmittingProps {
    username: string;
    selectedChar: Character;
    mindName: string;
    mind: any;
    handleLoaded: () => void;
}
const Submitting = ({
    username,
    selectedChar,
    mindName,
    mind,
    handleLoaded,
}: SubmittingProps) => {
    const res = useUpdateMind(
        username,
        selectedChar.toLocaleLowerCase(),
        mindName,
        mind
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
const SubmitMenu = ({ closeMenu, username }: SubmitMenuProps) => {
    const [state, setState] = useState<SubmitMenuState>(
        SubmitMenuState.SelectCharacter
    );

    const localState = getLocalState();

    let antoc;
    let jessica;
    if (localState) {
        antoc = localState.playerAgents.antoc;
        jessica = localState.playerAgents.jessica;
    }

    console.log('localState', localState, antoc, jessica);
    let content = null;

    const [selectedChar, setSelectedChar] = useState<Character>(
        Character.Jessica
    );

    const [mindName, setMindName] = useState('');

    const handleMindNameChange = (event) => {
        setMindName(event.target.value);
    };

    const handleSelectCharacter = (char: Character) => {
        setSelectedChar(char);
        setState(SubmitMenuState.NameMind);
    };

    const handleSubmitAgent = () => {
        setState(SubmitMenuState.Submitting);
    };

    if (state == SubmitMenuState.SelectCharacter) {
        content = (
            <Box>
                <Typography>Select Character to Submit</Typography>
                <Button
                    variant={'text'}
                    onClick={() => handleSelectCharacter(Character.Jessica)}
                    disabled={jessica === undefined}
                >
                    Jessica
                </Button>
                <Button
                    variant={'text'}
                    onClick={() => handleSelectCharacter(Character.Antoc)}
                    disabled={antoc === undefined}
                >
                    Antoc
                </Button>
            </Box>
        );
    } else if (state == SubmitMenuState.NameMind) {
        content = (
            <Box>
                <Typography>Name your mind</Typography>
                <input
                    autoFocus
                    type="text"
                    id="name"
                    placeholder="Mind Name"
                    style={{ width: '100%', marginTop: '1rem' }}
                    value={mindName}
                    onChange={handleMindNameChange}
                />

                <Button
                    variant={'text'}
                    disabled={mindName.length == 0}
                    onClick={() => handleSubmitAgent()}
                >
                    Submit
                </Button>
            </Box>
        );
    } else if (state == SubmitMenuState.Submitting) {
        content = (
            <Submitting
                mind={selectedChar == Character.Jessica ? jessica : antoc}
                username={username}
                selectedChar={selectedChar}
                mindName={mindName}
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
