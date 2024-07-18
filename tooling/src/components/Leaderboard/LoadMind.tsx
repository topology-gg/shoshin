import { Box, CircularProgress } from '@mui/material';
import { useGetMindFromId } from '../../../lib/api';
import { useEffect } from 'react';

const LoadMind = ({ mindId, onLoadMind }) => {
    console.log('res', mindId);
    const { data, error } = useGetMindFromId(mindId);
    const mind = data?.mind ? data.mind : undefined;

    useEffect(() => {
        if (mind) {
            onLoadMind(mind);
        }
        if (error) {
            onLoadMind(null);
        }
    }, [mind]);

    return (
        <Box>
            <CircularProgress />
        </Box>
    );
};

export default LoadMind;
