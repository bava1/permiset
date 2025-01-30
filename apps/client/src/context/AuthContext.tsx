import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { login as apiLogin, verifyToken } from "../api/auth";
import axiosClient from "../api/axiosClient";
import { User } from "../utils/interfaces/IUser";
import { AuthContextType } from "../utils/interfaces/IAuthContextType";
import { useRouter } from "next/router";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();
  const tokenRef = useRef<string | null>(null); // 🔥 Теперь токен сохраняется при смене языка

  // ✅ Вход в систему
  const login = async (email: string, password: string) => {
    try {
      const { token, refreshToken, user } = await apiLogin(email, password);
      if (!token) throw new Error("❌ Сервер не вернул токен!");

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        //sessionStorage.setItem("auth_token", token);
        localStorage.setItem("refresh_token", refreshToken);
      }

      tokenRef.current = token;
      setToken(token);
      setUser(user);
      setPermissions(user.permissions || []);
    } catch (err) {
      console.error("❌ Ошибка входа:", err);
    }
  };

  // ✅ Регистрация (чтобы убрать ошибку `missing register`)
  const register = async (name: string, email: string, password: string, role?: string, status?: string) => {
    try {
      await axiosClient.post("/auth/register", { name, email, password, role, status });
      if (!role && !status) await login(email, password);
    } catch (err: any) {
      console.error("❌ Ошибка регистрации:", err);
      throw new Error(err.response?.data?.message || "Ошибка регистрации.");
    }
  };

  // ✅ Выход из системы
  const logout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
      }
    } catch (err) {
      console.error("❌ Ошибка выхода:", err);
    } finally {
      tokenRef.current = null;
      setToken(null);
      setUser(null);
      setPermissions([]);
      router.replace("/auth/login");
    }
  };

  // ✅ Проверка прав (чтобы убрать ошибку `missing hasPermission`)
  const hasPermission = (permission: string): boolean => permissions.includes(permission);

  // ✅ Теперь токен загружается при смене языка
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      console.log("🔹 useEffect запущен. Найден токен:", storedToken);
  
      if (!storedToken) {
        setIsAuthLoading(false);
        return;
      }
  
      tokenRef.current = storedToken;
      setToken(storedToken);
      verifyToken()
        .then((user) => {
          setUser(user);
          setPermissions(user.permissions || []);
        })
        .catch(() => {
          console.warn("⚠️ Ошибка проверки токена, но logout НЕ выполняем.");
          setUser(null);
        })
        .finally(() => setIsAuthLoading(false));
    }
  }, [router.locale]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        login,
        register, // 🔥 ДОБАВЛЕНО → Больше нет ошибки missing register!
        logout,
        isAuthenticated,
        isAuthLoading,
        hasPermission, // 🔥 ДОБАВЛЕНО → Больше нет ошибки missing hasPermission!
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth должен использоваться внутри AuthProvider");
  return context;
};
