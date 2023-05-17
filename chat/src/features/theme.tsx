import { ThemeOptions, createTheme } from "@mui/material";
import merge from 'lodash/merge';

export const palette = {
    primary: {
        main: '#556cd6',
    },
    secondary: {
        main: '#19857b',
    },
};

export const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
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
    },
};

const lightThemeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
    },
};

export const darkTheme = createTheme(merge(themeOptions, darkThemeOptions));
export const lightTheme = createTheme(merge(themeOptions, lightThemeOptions));