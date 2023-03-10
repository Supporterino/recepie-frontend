import {
  blueGrey,
  grey,
  indigo,
  red,
} from '@mui/material/colors';
import {
  type Theme,
} from '@mui/material/styles';
import {
  createTheme,
} from '@mui/material/styles';

export const colorDefinition = {
  background: grey[900],
  error: red.A400,
  primary: indigo[500],
  secondary: blueGrey[500],
};

export const theme = (mode: 'dark' | 'light'): Theme => {
  return createTheme({
    palette: {
      error: {
        main: colorDefinition.error,
      },
      mode,
      primary: {
        main: colorDefinition.primary,
      },
      secondary: {
        main: colorDefinition.secondary,
      },
    },
  });
};

export default theme;
