import { createTheme } from "@mui/material/styles";

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
        accent: true,
        info: true,
    }
}

const theme = createTheme({
    typography: {
        fontFamily:
            "Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;",
        fontSize: 12,
    },
    palette: {
        primary: {
            main: "#000000",
        },
        secondary: {
            main: "#2d4249",
        },
        info: {
            main: "#848f98",
        },
        accent: {
            main: "#52af77",
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    color: "black",
                    backgroundColor: "white",
                    ":hover": {
                        backgroundColor: "#52af77",
                        color: "#fff",
                        transition: "background 0.2s, color 0.2s",
                    },
                },
            },
        },
    },
});

export default theme
