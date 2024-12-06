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

  /*
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);
  */
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

