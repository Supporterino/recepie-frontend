/* eslint-disable import/no-unassigned-import */
import './App.css';
import './utils/i18n';
import Layout from './components/Layout';
import {
  type ThemeOptions,
} from './services/ColorModeContext';
import ColorModeContext from './services/ColorModeContext';
import {
  theme,
} from './theme';
import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {
  SnackbarProvider,
} from 'notistack';
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  BrowserRouter,
} from 'react-router-dom';

const App: React.FunctionComponent = () => {
  const THEME_KEY = 'themeMode';
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  const preferesDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [
    mode,
    setMode,
  ] = useState<ThemeOptions>((localStorage.getItem(THEME_KEY) as ThemeOptions) || 'auto');
  const colorMode = useMemo(
    () => {
      return {
        getActiveMode: () => {
          return mode;
        },
        setColorMode: (value: ThemeOptions) => {
          switch (value) {
            case 'light':
              setMode('light');
              break;
            case 'dark':
              setMode('dark');
              break;
            case 'auto':
              setMode('auto');
              break;
            default:
              setMode('auto');
              break;
          }
        },
      };
    },
    [
      mode,
    ],
  );
  const activeTheme = useMemo(() => {
    // eslint-disable-next-line unicorn/no-nested-ternary
    return theme(mode === 'auto' ? preferesDarkMode ? 'dark' : 'light' : mode);
  }, [
    mode,
    preferesDarkMode,
  ]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
  }, [
    mode,
  ]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={activeTheme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SnackbarProvider
              anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom',
              }}
              autoHideDuration={3_000}
              dense
              maxSnack={3}
            >
              <CssBaseline />
              <Layout />
            </SnackbarProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
