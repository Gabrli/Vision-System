import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const Layout = ({ children, toggleTheme }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <Sidebar toggleTheme={toggleTheme} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          position: 'relative',
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[50]
              : theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
