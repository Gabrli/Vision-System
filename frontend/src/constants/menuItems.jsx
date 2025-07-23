import {
  Home,
  Dashboard,
  Videocam,
  Science,
  Settings,
} from "@mui/icons-material";

export const MENU_ITEMS = [
  { text: "Home", icon: <Home />, path: "/" },
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { text: "Live Analysis", icon: <Videocam />, path: "/live-analysis" },
  { text: "Charts", icon: <Science />, path: "/charts" },
  { text: "Settings", icon: <Settings />, path: "/settings" },
];
