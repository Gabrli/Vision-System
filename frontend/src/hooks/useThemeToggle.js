import { useState, useMemo } from 'react';
import { createTheme } from '@mui/material';

const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#1976d2',
            },
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
          }
        : {
            primary: {
              main: '#90caf9',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
          }),
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.005em',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '0',
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '0',
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        letterSpacing: '-0.01em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        letterSpacing: '-0.01em',
      },
      button: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });
};

export const useThemeToggle = () => {
  // Get saved theme from localStorage or default to 'dark'
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'dark';
  });
  
  const theme = useMemo(() => getTheme(mode), [mode]);
  
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  return { theme, toggleTheme };
};
