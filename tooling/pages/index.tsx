import * as amplitude from '@amplitude/analytics-browser';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import mixpanel from 'mixpanel-browser';
import Head from 'next/head';
import SceneSelector from '../src/components/layout/SceneSelector';
import preloadImages from '../src/constants/preloadImages';
import { darkTheme } from '../src/theme/theme';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN, {
    track_pageview: true,
    persistence: 'localStorage',
});

amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_APIKEY, {
    defaultTracking: {
        attribution: true,
        pageViews: true,
        sessions: true,
        formInteractions: false,
        fileDownloads: false,
    },
});


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
