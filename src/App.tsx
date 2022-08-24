import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import ColorModeContext, { themeMode } from './services/ThemeContext';
import theme from './theme';

const App: React.FunctionComponent = () => {
  const THEME_KEY = 'themeMode'
  const queryClient = new QueryClient();
  const [mode, setMode] = useState<themeMode>(localStorage.getItem(THEME_KEY) as themeMode || 'light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  const activeTheme = useMemo(
    () => theme(mode),
    [mode],
  );

  useEffect(() => {localStorage.setItem(THEME_KEY, mode)}, [mode])

  return <ColorModeContext.Provider value={colorMode}>
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
};

export default App;
