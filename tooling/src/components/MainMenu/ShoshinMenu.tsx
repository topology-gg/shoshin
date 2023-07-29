import {
    Box,
    Checkbox,
    FormControlLabel,
    Slider,
    Stack,
    Typography,
} from '@mui/material';
import ShoshinMenuButton from '../ui/ShoshinMenuButton';
import LogoBig from '../layout/LogoBig';
import { VolumeDown, VolumeUp } from '@mui/icons-material';

export interface ShoshinMenuItem {
    title: string;
    onClick?: (args?: string) => void;
}

interface ShoshinMenuProps {
    displayLogo: boolean;
    menuItems: ShoshinMenuItem[];
    volume?: number;
    setVolume?: (volume: number) => void;
    showFullReplay?: boolean;
    setShowFullReplay?: (showFullReplay: boolean) => void;
}
const ShoshinMenu = ({
    displayLogo,
    menuItems,
    volume,
    setVolume,
    showFullReplay,
    setShowFullReplay,
}: ShoshinMenuProps) => {
    const buttons = menuItems.map((item) => {
        return (
            <ShoshinMenuButton
                variant="text"
                size="large"
                onClick={() =>
                    item.onClick !== undefined ? item.onClick() : {}
                }
                disabled={item.onClick !== undefined ? false : true}
            >
                {item.title}
            </ShoshinMenuButton>
        );
    });

    const handleVolumeChange = (event, newVolume) => {
        setVolume(newVolume);
    };
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="30%"
            width="25%"
            mt={displayLogo ? 0 : 40}
        >
            {displayLogo && <LogoBig />}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {volume !== undefined && setVolume !== undefined && (
                    <Box
                        sx={{
                            border: '1px solid black', // Change the border style as needed
                            background: 'rgb(105, 104, 104, .8)', // Use your preferred grey color here
                            padding: '16px', // Adjust padding as needed
                            borderRadius: '10px', // Adjust border radius as needed
                            marginBottom: '10px', // Adjust margin as needed
                        }}
                    >
                        <Typography color={'white'}>Volume</Typography>
                        <Stack
                            spacing={2}
                            direction="row"
                            sx={{ mb: 1 }}
                            alignItems="center"
                            color="white"
                        >
                            <VolumeDown />
                            <Slider
                                aria-label="Volume"
                                value={volume}
                                onChange={handleVolumeChange}
                            />
                            <VolumeUp />
                        </Stack>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showFullReplay}
                                    onChange={() =>
                                        setShowFullReplay(!showFullReplay)
                                    }
                                />
                            }
                            label="Full Screen Winning Replays"
                        />
                    </Box>
                )}
                {buttons}
            </Box>
        </Box>
    );
};

export default ShoshinMenu;
