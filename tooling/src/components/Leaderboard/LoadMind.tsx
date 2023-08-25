import { Box, CircularProgress } from '@mui/material';
import { useGetMindFromId } from '../../../lib/api';
import { useEffect } from 'react';

const LoadMind = ({ mindId, onLoadMind }) => {
    const { data: data } = useGetMindFromId(mindId);
    const mind = data?.mind ? data.mind : undefined;

    useEffect(() => {
        onLoadMind(mind);
    }, [mind]);

    return (
        <Box>
            <CircularProgress />
        </Box>
    );
};

export default LoadMind;
