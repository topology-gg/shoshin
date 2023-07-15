import SceneSelector from '../../src/components/layout/SceneSelector';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import theme from '../../src/theme/theme';
import Head from 'next/head';
export default function Home() {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Head>
                    <link
                        rel="preload"
                        href="/images/logo/shoshin-logo-big.png"
                        as="image"
                    />
                </Head>
                <SceneSelector />
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
