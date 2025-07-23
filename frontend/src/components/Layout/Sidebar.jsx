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
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/NIELSEN AI.PNG";
import { MENU_ITEMS } from "../../constants/menuItems";

const drawerWidth = 240;

const Sidebar = ({ toggleTheme }) => {
  const { palette } = useTheme();
  const { background, divider, text, primary } = palette;
  const { mode } = palette

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: `1px solid ${divider}`,
          backgroundColor: mode === "light" ? "#fff" : background.default,
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: `1px solid ${divider}`,
            minHeight: "80px",
            backgroundColor: mode === "dark" ? "#1a1a1a" : "#fff",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: "160px",
              height: "auto",
              maxHeight: "60px",
              objectFit: "contain",
              filter: mode === "light" ? "invert(1) brightness(0.2)" : "none",
            }}
          />
        </Box>

        <List sx={{ flexGrow: 1 }}>
          {MENU_ITEMS.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                selected={location.pathname === path}
                onClick={() => navigate(path)}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  "&.Mui-selected": {
                    backgroundColor:
                      mode === "light"
                        ? "rgba(25, 118, 210, 0.08)"
                        : "rgba(144, 202, 249, 0.08)",
                    "&:hover": {
                      backgroundColor:
                        mode === "light"
                          ? "rgba(25, 118, 210, 0.12)"
                          : "rgba(144, 202, 249, 0.12)",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color:
                      location.pathname === path
                        ? primary.main
                        : text.secondary,
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: location.pathname === path ? 600 : 400,
                      color:
                        location.pathname === path
                          ? text.primary
                          : text.secondary,
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
              width: "100%",
              borderRadius: 2,
              p: 1.5,
              color: text.secondary,
              backgroundColor:
                mode === "light"
                  ? "rgba(0, 0, 0, 0.04)"
                  : "rgba(255, 255, 255, 0.04)",
              "&:hover": {
                backgroundColor:
                  mode === "light"
                    ? "rgba(0, 0, 0, 0.08)"
                    : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
