import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // Разрешённые роли для этого маршрута
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, isAuthLoading, user, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const verifyAccess = async () => {
      if (isAuthLoading) return; // Ждём завершения загрузки

      if (!isAuthenticated) {
        console.warn("User not authenticated. Redirecting...");
        await logout();
        router.replace("/auth/login"); // Используем replace для полного перехода
        return;
      }

      if (roles && !roles.includes(user?.role || "")) {
        console.warn("Access denied. Redirecting...");
        await logout();
        router.replace("/auth/login"); // Используем replace
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


/*
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    if (!isAuthenticated) {
      console.log("Redirecting to /auth/login");
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (isAuthLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};


export default ProtectedRoute;
*/
