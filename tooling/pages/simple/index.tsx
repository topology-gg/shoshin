import SceneSelector from '../../src/components/layout/SceneSelector';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import theme from '../../src/theme/theme';
export default function Home() {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <SceneSelector />
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
