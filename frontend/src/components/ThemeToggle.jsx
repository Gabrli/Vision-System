import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const ThemeToggle = ({ toggleTheme }) => {
  const theme = useTheme();

  return (
    <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggle;
