import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";
import { ProtectedRouteProps } from "../utils/interfaces/IProtectedRouteProps";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, isAuthLoading, user, logout } = useAuth();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      console.log("🔹Checking access: ", { isAuthLoading, isAuthenticated, user });

      if (isAuthLoading) return; // ✅ Waiting for loading

      if (!isAuthenticated) {
        console.warn("❌User not authenticated. Navigating to /auth/login... ");
        setRedirecting(true); // ✅ We show the spinner
        router.replace("/auth/login");
        return;
      }

      if (roles && !roles.includes(user?.role || "")) {
        console.warn("❌Access denied. Insufficient rights. ");
        setRedirecting(true); // ✅ Show spinner before logout
        router.replace("/auth/login");
        return;
      }

      setIsVerified(true);
    };

    verifyAccess();
  }, [isAuthenticated, isAuthLoading, user, roles, router, logout]);

  // ✅ For now, we check access or redirect → we show only the spinner
  if (isAuthLoading || redirecting || !isVerified) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
