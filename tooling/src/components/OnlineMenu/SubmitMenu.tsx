import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Character } from '../../constants/constants';

interface SubmitMenuProps {
    closeMenu: () => void;
}

enum SubmitMenuState {
    Submitting = 'Submitting',
    SelectCharacter = 'SelectCharacter',
    NameMind = 'NameMind',
    Success = 'Success',
}

const SubmitMenu = ({ closeMenu }: SubmitMenuProps) => {
    const [state, setState] = useState<SubmitMenuState>(
        SubmitMenuState.SelectCharacter
    );

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
                >
                    Jessica
                </Button>
                <Button
                    variant={'text'}
                    onClick={() => handleSelectCharacter(Character.Antoc)}
                >
                    Antoc
                </Button>
            </Box>
        );
    } else if (state == SubmitMenuState.NameMind) {
        content = (
            <Box>
                <Typography>Name your mind</Typography>
                <TextField
                    label="Mind Name"
                    value={mindName}
                    onChange={handleMindNameChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <Button variant={'text'} onClick={() => handleSubmitAgent()}>
                    Submit
                </Button>
            </Box>
        );
    } else
        content = (
            <Box>
                <Typography>Agent Submitted</Typography>
                <Button variant={'text'} onClick={() => closeMenu()}>
                    Close
                </Button>
            </Box>
        );

    return <Box>{content}</Box>;
};

export default SubmitMenu;
