import { PaletteMode } from '@mui/material';
import { createContext } from 'react';

const ColorModeContext = createContext({
    setColorMode: (value: ThemeOptions) => {},
    getActiveMode: (): ThemeOptions => {
        return 'auto';
    },
});

export type ThemeOptions = PaletteMode | 'auto';

export default ColorModeContext;
