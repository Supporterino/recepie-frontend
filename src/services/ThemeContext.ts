import { createContext } from 'react';

const ColorModeContext = createContext({
  toggleColorMode: () => {}
});

export type themeMode = 'light' | 'dark';

export default ColorModeContext;
