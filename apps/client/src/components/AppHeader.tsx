import React, { useState } from "react";
import { AppBar, Box, IconButton, Toolbar, Tooltip, Avatar, Menu, MenuItem, Typography, Zoom } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import HeaderClockCalendar from "./HeaderClockCalendar";
import LanguageSwitcher from "./LanguageSwitcher";

interface AppHeaderProps {
  onToggleDrawer: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onToggleDrawer }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" edge="start" onClick={onToggleDrawer} sx={{ mr: 2, display: { md: "inline-flex", lg: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Image style={{ marginTop: "4px", marginLeft: "4px" }} src="/img/Logo1.png" alt="Logo" width={170} height={45} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <HeaderClockCalendar />
          <LanguageSwitcher />
          <Tooltip sx={{ p: 2 }} title="You don't have any messages yet." placement="bottom" arrow slots={{ transition: Zoom }}>
            <NotificationsNoneIcon sx={{ mr: 2, fontSize: "30px", opacity: 0.8 }} />
          </Tooltip>
          <Tooltip title="User Options" slots={{ transition: Zoom }}>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              {user?.userImg ? (
                <Avatar src={`/imgContact/${user.userImg}.jpg`} alt={user?.name || "User"} sx={{ width: 45, height: 45, boxShadow: 2 }} />
              ) : (
                <Avatar sx={{ color: "blue", width: 45, height: 45 }}>{user?.name?.[0]?.toUpperCase() || "U"}</Avatar>
              )}
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
            <MenuItem disabled><Typography variant="body2">Name: {user?.name}</Typography></MenuItem>
            <MenuItem disabled><Typography variant="body2">Email: {user?.email}</Typography></MenuItem>
            <MenuItem disabled><Typography variant="body2">Role: {user?.role}</Typography></MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
