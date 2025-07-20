import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Home,
  Dashboard,
  Videocam,
  Science,
  Settings,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/nielsen-ai-logo.avif';

const drawerWidth = 240;

const menuItems = [
  { text: 'Home', icon: <Home />, path: '/' },
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Live Analysis', icon: <Videocam />, path: '/live-analysis' },
  { text: 'Charts', icon: <Science />, path: '/charts' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar = ({ toggleTheme }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === 'light'
            ? '#fff'
            : theme.palette.background.default,
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
            minHeight: '80px',
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff',
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: '160px',
              height: 'auto',
              maxHeight: '60px',
              objectFit: 'contain',
              filter: theme.palette.mode === 'light' ? 'invert(1) brightness(0.2)' : 'none',
            }}
          />
        </Box>

        <List sx={{ flexGrow: 1 }}>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                selected={location.pathname === path}
                onClick={() => navigate(path)}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? 'rgba(25, 118, 210, 0.08)'
                      : 'rgba(144, 202, 249, 0.08)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(25, 118, 210, 0.12)'
                        : 'rgba(144, 202, 249, 0.12)',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: location.pathname === path
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: location.pathname === path ? 600 : 400,
                      color: location.pathname === path
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2 }}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              width: '100%',
              borderRadius: 2,
              p: 1.5,
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.mode === 'light'
                ? 'rgba(0, 0, 0, 0.04)'
                : 'rgba(255, 255, 255, 0.04)',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.08)'
                  : 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
