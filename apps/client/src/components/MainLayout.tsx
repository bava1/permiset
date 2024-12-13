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
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BugReportIcon from "@mui/icons-material/BugReport";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsIcon from "@mui/icons-material/Settings";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import logo from './assets/img/Logo1.png'; 
import Image from 'next/image';

const drawerWidth = 240;

interface MainLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: <HomeIcon />, roles: ["User", "Manager", "Administrator"] },
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, roles: ["Manager", "Administrator"] },
  { label: "Users", path: "/users", icon: <PeopleIcon />, roles: ["Manager", "Administrator"] },
  { label: "Issues", path: "/issues", icon: <BugReportIcon />, roles: ["Manager", "Administrator"] },
  { label: "Blog", path: "/blog", icon: <MarkUnreadChatAltIcon />, roles: ["User", "Manager", "Administrator"] },
  { label: "Logs", path: "/logs", icon: <SyncAltIcon />, roles: ["Administrator"] },
  { label: "Docs", path: "/docs", icon: <ArticleIcon />, roles: ["User", "Manager", "Administrator"] },
  { label: "Settings", path: "/setting", icon: <SettingsIcon />, roles: ["Administrator"] },
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
      {NAV_ITEMS.filter((item) => item.roles.includes(user?.role || "")).map((item) => (
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
              sx={{ mr: 2, display: { md: "inline-flex", lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box>
              <Image style={{marginTop: "4px"}} src="/img/Logo1.png" alt="Logo" width={170} height={45} />
            </Box>
          </Box>


          {/* Правая часть: иконка пользователя */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="User Options">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar sx={{ color: "blue" }}>{user?.email?.[0]?.toUpperCase() || "U"}</Avatar>
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
                <Typography variant="body2">Name: {user?.name}</Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="body2">Email: {user?.email}</Typography>
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
          marginTop: "-30px",
        }}
      >
        <Toolbar />
        <ProtectedRoute roles={NAV_ITEMS.find((item) => item.path === router.pathname)?.roles}>
          {children}
        </ProtectedRoute>
      </Box>
    </Box>
  );
};

export default MainLayout;
