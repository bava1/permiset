import React, { ReactNode, useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
  Menu,
  MenuItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BugReportIcon from "@mui/icons-material/BugReport";
import ArticleIcon from "@mui/icons-material/Article";
// import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
//import VoiceChatIcon from '@mui/icons-material/VoiceChat';
// import LogoutIcon from '@mui/icons-material/Logout';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

interface MainLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { label: "Home", icon: <HomeIcon />, path: "/" },
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Users", icon: <PeopleIcon />, path: "/users" },
  { label: "Issues", icon: <BugReportIcon />, path: "/issues" },
  { label: "Blog", icon: <MarkUnreadChatAltIcon />, path: "/blog" },
  { label: "Logs", icon: <SyncAltIcon />, path: "/logs" },
  { label: "Docs", icon: <ArticleIcon />, path: "/docs" },
  { label: "Settings", icon: <SettingsIcon />, path: "/setting" },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // Экран меньше 996px
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(!isSmallScreen); // Драйвер открыт только для больших экранов

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isSmallScreen) {
      setDrawerOpen(false); // Закрываем Drawer на мобильных устройствах после навигации
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawerContent = (
    <List>
      {NAV_ITEMS.map((item) => (
        <ListItemButton
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          sx={{
            backgroundColor: router.pathname === item.path ? "rgba(0, 0, 0, 0.08)" : "transparent",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Левая часть: кнопка меню */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2, display: { xs: "inline-flex", sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              PermiSET
            </Typography>
          </Box>

          {/* Правая часть: иконка пользователя */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="User Options">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar>{user?.email?.[0]?.toUpperCase() || "U"}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem disabled>
                <Typography variant="body2">Name: {user?.email}</Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="body2">Role: {user?.role}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isSmallScreen ? "temporary" : "persistent"}
        open={drawerOpen}
        onClose={toggleDrawer} // Закрытие для маленьких экранов
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
      <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 5,
            transition: "margin 0.3s",
          }}
        >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
