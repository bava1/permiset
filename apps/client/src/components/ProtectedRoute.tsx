import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";
import { ProtectedRouteProps } from "../utils/interfaces/IProtectedRouteProps";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, isAuthLoading, user, logout } = useAuth();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      console.log("🔹 Проверяем доступ:", { isAuthLoading, isAuthenticated, user });
      if (isAuthLoading) return; // Ждём загрузки

      if (!isAuthenticated) {
        console.warn("❌ Пользователь не аутентифицирован. Ожидаем перед редиректом...");
        return;
      }

      if (roles && !roles.includes(user?.role || "")) {
        console.warn("❌ Доступ запрещен. Недостаточно прав.");
        await logout();
        router.replace("/auth/login");
      }

      setIsVerified(true);
    };

    verifyAccess();
  }, [isAuthenticated, isAuthLoading, user, roles, router, logout]);

  // Пока аутентификация загружается – показываем лоадер
  if (isAuthLoading || !isVerified) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
