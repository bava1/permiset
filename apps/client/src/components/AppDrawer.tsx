import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import useNavItems from "../config/NavItems";

const drawerWidth = 240;

interface AppDrawerProps {
  open: boolean;
  onToggleDrawer: () => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({ open, onToggleDrawer }) => {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const NAV_ITEMS = useNavItems();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isSmallScreen) onToggleDrawer();
  };

  return (
    <Drawer
      variant={isSmallScreen ? "temporary" : "persistent"}
      open={open}
      onClose={onToggleDrawer}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        {NAV_ITEMS.filter((item) => item.roles.includes(user?.role || "")).map((item) => (
          <ListItemButton key={item.path} onClick={() => handleNavigation(item.path)}
            sx={{
              backgroundColor: router.pathname === item.path ? "rgba(0, 0, 0, 0.08)" : "transparent",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 45 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default AppDrawer;
