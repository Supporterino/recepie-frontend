import { createTheme, Theme } from '@mui/material/styles';
import { blueGrey, grey, indigo, red } from '@mui/material/colors';

export const colorDefinition = {
  primary: indigo[500],
  secondary: blueGrey[500],
  error: red.A400,
  background: grey[900]
};

export const theme = (mode: 'light' | 'dark'): Theme => {
  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: colorDefinition.primary
      },
      secondary: {
        main: colorDefinition.secondary
      },
      error: {
        main: colorDefinition.error
      }
    }
  });
};

export default theme;
