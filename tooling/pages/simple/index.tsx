import SceneSelector from '../../src/components/layout/SceneSelector';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import theme, { darkTheme } from '../../src/theme/theme';
import Head from 'next/head';

export default function Home() {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <Head>
                    <link
                        rel="preload"
                        href="/images/logo/shoshin-logo-big.png"
                        as="image"
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Dela+Gothic+One"
                    />
                </Head>
                <SceneSelector />
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
