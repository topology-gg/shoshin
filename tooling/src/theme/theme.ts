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
            'Eurostile, Raleway, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;',
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

export const darkTheme = createTheme({
    typography: {
        fontFamily:
            'Eurostile, Dela Gothic One, Raleway, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;',
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
        body1: {
            color: '#000',
            letterSpacing: '1.6px',
        },
        body2: {
            color: '#000',
            letterSpacing: '1.6px',
        },
        h6: {
            color: 'black',
        },
    },

    palette: {
        mode: 'light',
        primary: {
            main: '#000',
            dark: '#000',
        },
        secondary: {
            main: '#FC5954',
            dark: '#000',
        },
        info: {
            main: '#848f98',
        },
        accent: {
            main: '#52af77',
        },
        text: {
            primary: '#000',
            secondary: '#000',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    color: 'black',
                    backgroundColor: '#ddd',
                    ':hover': {
                        backgroundColor: '#f1573b',
                        color: '#000',
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

export const darkThemeBackup = createTheme({
    typography: {
        fontFamily:
            'Dela Gothic One, Raleway, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;',
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
        body1: {
            color: '#fff',
            letterSpacing: '1.6px',
        },
        body2: {
            color: '#fff',
            letterSpacing: '1.6px',
        },
        h6: {
            color: 'white',
        },
    },

    palette: {
        mode: 'dark',
        primary: {
            main: '#fff',
            dark: '#fff',
        },
        secondary: {
            main: '#FC5954',
            dark: '#fff',
        },
        info: {
            main: '#848f98',
        },
        accent: {
            main: '#52af77',
        },
        text: {
            primary: '#fff',
            secondary: '#fff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    color: 'white',
                    backgroundColor: 'black',
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
