import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useThemeToggle } from './hooks/useThemeToggle';
import Layout from './components/Layout/Layout';
import AppRoutes from './routes';

const queryClient = new QueryClient();

function App() {
  const { theme, toggleTheme } = useThemeToggle();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            width: '100vw',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[50]
                : theme.palette.background.default,
            overflow: 'hidden',
          }}
        >
          <Router>
            <Layout toggleTheme={toggleTheme}>
              <AppRoutes />
            </Layout>
          </Router>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
