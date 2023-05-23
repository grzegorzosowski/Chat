import { Theme, PaletteColor, PaletteColorOptions } from '@mui/material';

declare module '@mui/material/styles' {
    interface Palette {
        neutral: PaletteColor;
    }
    interface PaletteOptions {
        neutral: PaletteColorOptions;
    }
}
