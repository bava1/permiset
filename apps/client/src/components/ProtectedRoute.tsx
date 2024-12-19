import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";
import { ProtectedRouteProps } from "../utils/interfaces/IProtectedRouteProps";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, isAuthLoading, user, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const verifyAccess = async () => {
      if (isAuthLoading) return; // Waiting for the download to complete

      if (!isAuthenticated) {
        console.warn("User not authenticated. Redirecting...");
        await logout();
        router.replace("/auth/login"); 
        return;
      }

      if (roles && !roles.includes(user?.role || "")) {
        console.warn("Access denied. Redirecting...");
        await logout();
        router.replace("/auth/login"); 
      }
    };

    verifyAccess();
  }, [isAuthenticated, isAuthLoading, user, roles, router, logout]);

  if (isAuthLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
