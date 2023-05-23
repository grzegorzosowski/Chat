import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from './theme';
import { lightTheme } from './theme';
import { PaletteMode } from '@mui/material';

const THEME_KEY = 'theme';

export type CurrentThemeContextType = {
    theme: PaletteMode;
    setTheme: (theme: PaletteMode) => void;
};

const defaultContext: CurrentThemeContextType = {
    theme: 'light',
    setTheme: () => {
        console.warn('No theme provider found');
    },
} as const;

function isPaletteMode(theme: string | null): theme is PaletteMode {
    return theme === 'light' || theme === 'dark';
}

const CurrentThemeContext = React.createContext<CurrentThemeContextType>(defaultContext);

export function useCurrentTheme() {
    return React.useContext(CurrentThemeContext);
}


export function CurrentThemeProvider({ children }: { children: React.ReactNode }) {
    const [currentPalette, setCurrentPalette] = React.useState<PaletteMode | null>(null);

    React.useEffect(() => {
        const storedTheme = window.localStorage.getItem(THEME_KEY);
        if (isPaletteMode(storedTheme)) {
            setCurrentPalette(storedTheme);
        } else {
            setCurrentPalette(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        }
    }, []);

    const setPalette = React.useCallback((theme: PaletteMode) => {
        window.localStorage.setItem(THEME_KEY, theme);
        setCurrentPalette(theme);
    }, [setCurrentPalette])

    const contextValue = React.useMemo(
        () => ({
            theme: currentPalette ?? 'light',
            setTheme: setPalette,
        }),
        [currentPalette, setPalette]
    );

    const theme = React.useMemo(() => {
        if (currentPalette === 'dark') {
            return darkTheme;
        } else {
            return lightTheme;
        }
    }, [currentPalette]);

    React.useEffect(() => {
        document.documentElement.style.setProperty('color-scheme', currentPalette);
    }, [currentPalette]);

    if (currentPalette === null) {
        return null;
    }

    return (
        <CurrentThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </CurrentThemeContext.Provider>)
}