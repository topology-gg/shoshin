import SceneSelector from '../src/components/layout/SceneSelector';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import theme, { darkTheme } from '../src/theme/theme';
import Head from 'next/head';
import preloadImages from '../src/constants/preloadImages';

export default function Home() {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <Head>
                    {preloadImages.map((img) => (
                        <link rel="preload" href={img} as="image" />
                    ))}

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
