import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        accent: { main: string };
    }
    // allow configuration using `createTheme`
    interface PaletteOptions {
        accent?: { main: string };
    }

    interface TypographyVariants {
        poster: React.CSSProperties;
    }

    interface TypographyVariantsOptions {
        poster?: React.CSSProperties;
    }
}

declare module '@mui/material/Slider' {
    interface SliderPropsColorOverrides {
        accent: true;
        info: true;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        poster: true;
    }
}

const theme = createTheme({
    typography: {
        fontFamily:
            'Raleway, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;',
        fontSize: 12,
        poster: {
            fontFamily: 'Dela Gothic One',
            fontSize: '2.5rem',
            fontWeight: '900',
            letterSpacing: '0.15em',
        },
        h3: {
            fontFamily: 'Dela Gothic One',
            fontSize: '1.8rem',
            letterSpacing: '0.15em',
        },
    },
    palette: {
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#FC5954',
        },
        info: {
            main: '#848f98',
        },
        accent: {
            main: '#52af77',
        },
        background: {
            default: '#FC5954',
            paper: '#fff',
        },
        text: {
            secondary: '#fff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    color: 'black',
                    backgroundColor: 'white',
                    ':hover': {
                        backgroundColor: '#f1573b',
                        color: '#fff',
                        transition: 'background 0.1s, color 0.1s',
                    },
                },
            },
        },
        MuiMobileStepper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                },
            },
        },
    },
});

export default theme;
