import React, { useState } from "react";
import { Box, CssBaseline, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import ProtectedRoute from "./ProtectedRoute";
import AppHeader from "./AppHeader";
import AppDrawer from "./AppDrawer";
import useNavItems from "../config/NavItems";
import { MainLayoutProps } from "../utils/interfaces/IMainLayoutProps";

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState<boolean>(!isSmallScreen);
  const NAV_ITEMS = useNavItems();

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppHeader onToggleDrawer={toggleDrawer} />
      <AppDrawer open={drawerOpen} onToggleDrawer={toggleDrawer} />
      <Box component="main" sx={{ flexGrow: 1, p: 5, transition: "margin 0.3s", marginTop: "-35px" }}>
        <Toolbar />
        <ProtectedRoute roles={NAV_ITEMS.find((item) => item.path === router.pathname)?.roles}>
          {children}
        </ProtectedRoute>
      </Box>
    </Box>
  );
};

export default MainLayout;
