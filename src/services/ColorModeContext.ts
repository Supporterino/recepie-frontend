import {
  type PaletteMode,
} from '@mui/material';
import {
  createContext,
} from 'react';

const ColorModeContext = createContext({
  getActiveMode: (): ThemeOptions => {
    return 'auto';
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setColorMode: (value: ThemeOptions) => {},
});

export type ThemeOptions = PaletteMode | 'auto';

export default ColorModeContext;
