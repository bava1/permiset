import React, { useState } from "react";
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
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Image from 'next/image';
import { NAV_ITEMS } from "../config/NavItems";
import { MainLayoutProps } from "../utils/interfaces/IMainLayoutProps";

const drawerWidth = 240;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // Screen less than 996px
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(!isSmallScreen); // The driver is only open for large screens

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isSmallScreen) {
      setDrawerOpen(false); // Close Drawer on mobile devices after navigation
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
          {/*Left side: menu button */}
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


          {/* Right side: user icon */}
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
        onClose={toggleDrawer} // Close for small screens
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
