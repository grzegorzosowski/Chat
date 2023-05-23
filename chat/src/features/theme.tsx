import { PaletteColor, PaletteColorOptions, PaletteOptions, ThemeOptions, createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import merge from 'lodash/merge';

declare module '@mui/material/styles' {
    interface Palette {
        neutral: PaletteColor;
    }
    interface PaletteOptions {
        neutral: PaletteColorOptions;
    }
}


export const palette: PaletteOptions = {
    primary: {
        main: '#19857b',
    },
    secondary: {
        main: '#121212',
    },
    neutral: {
        main: grey[900],
        light: grey[300],
    }
};

export const theme = createTheme({
    palette: {
        primary: {
            main: '#19857b',
        },
        neutral: {
            main: grey[900],
        },
    },
});

const themeOptions: ThemeOptions = {
    palette,
    typography: {
        fontFamily: 'Roboto, sans-serif'
    },
};


const darkThemeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        neutral: {
            main: grey[900],
        },
    },
};

const lightThemeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        neutral: {
            main: grey[900],
        },
    },
};

export const darkTheme = createTheme(merge(themeOptions, darkThemeOptions));
export const lightTheme = createTheme(merge(themeOptions, lightThemeOptions));