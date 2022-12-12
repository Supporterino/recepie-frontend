import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import ColorModeContext, { ThemeOptions } from './services/ThemeContext';
import theme from './theme';
import './utils/i18n';
const App: React.FunctionComponent = () => {
  const THEME_KEY = 'themeMode';
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  });
  const preferesDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<ThemeOptions>(
    (localStorage.getItem(THEME_KEY) as ThemeOptions) || 'auto'
  );
  const colorMode = useMemo(
    () => ({
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
        }
      },
      getActiveMode: () => {
        return mode;
      }
    }),
    [mode]
  );
  const activeTheme = useMemo(
    () => theme(mode === 'auto' ? (preferesDarkMode ? 'dark' : 'light') : mode),
    [mode, preferesDarkMode]
  );

  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={activeTheme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              autoHideDuration={3000}
              dense
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
