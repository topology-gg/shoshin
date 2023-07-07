import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        accent: { main: string };
    }
    // allow configuration using `createTheme`
    interface PaletteOptions {
        accent?: { main: string };
    }
}

declare module '@mui/material/Slider' {
    interface SliderPropsColorOverrides {
        accent: true;
        info: true;
    }
}

const theme = createTheme({
    typography: {
        fontFamily:
            'Raleway, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;',
        fontSize: 12,
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
