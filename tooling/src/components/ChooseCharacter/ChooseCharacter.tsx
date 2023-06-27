import {
    AppBar,
    Box,
    Button,
    MenuItem,
    Select,
    Toolbar,
    Typography,
    styled,
} from '@mui/material';
import styles from './MainMenu.module.css';
import { Character } from '../../constants/constants';

const StyledBox = styled(Box)`
    border: 1px solid black;
    padding: 16px;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        background-color: lightgray;
        color: white;
        cursor: pointer;
    }

    &.selected {
        background-color: gray;
        color: white;
    }
`;

const ChooseCharacter = ({ transitionChooseOpponent }) => {
    return (
        <div>
            <AppBar
                position="static"
                style={{ background: 'transparent', boxShadow: 'none' }}
            >
                <Toolbar>
                    <Typography color={'black'} variant="h6">
                        Shoshin
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width={'100%'}
            >
                <Typography variant="h5" gutterBottom>
                    Choose your character
                </Typography>

                <Box display="flex" justifyContent="center" alignItems="center">
                    <StyledBox
                        width="400px"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        className="character-box"
                        onClick={() =>
                            transitionChooseOpponent(Character.Jessica)
                        }
                    >
                        <Typography variant="h4">Jessica</Typography>
                        <img
                            src="images/jessica/idle/right/frame_0.png"
                            alt="Image 1"
                            height="200px"
                        />
                        <Typography variant="h6">Progress 0%</Typography>
                        <Typography variant="body2">
                            Additional descriptive text
                        </Typography>
                    </StyledBox>
                    <StyledBox
                        width="400px"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        className="character-box"
                        marginLeft={'10px'}
                        onClick={() =>
                            transitionChooseOpponent(Character.Antoc)
                        }
                    >
                        <Typography variant="h4">Antoc</Typography>
                        <img
                            src="images/antoc/idle/left/frame_0.png"
                            alt="Image 2"
                            height="220px"
                            style={{
                                objectFit: 'cover',
                                marginTop: '-10px',
                                marginBottom: '-10px',
                            }}
                        />
                        <Typography variant="h6">Progress 0%</Typography>
                        <Typography variant="body2">
                            Additional descriptive text
                        </Typography>
                    </StyledBox>
                </Box>
                <Button variant="contained" sx={{ marginTop: '30px' }}>
                    Back
                </Button>
            </Box>
        </div>
    );
};

export default ChooseCharacter;
