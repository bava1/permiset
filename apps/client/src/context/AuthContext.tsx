import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, verifyToken } from "../api/auth";
import axiosClient from "../api/axiosClient";

// Типы данных пользователя
interface User {
  id: string;
  role: string;
  email: string;
  name: string; // Добавлено для полной информации о пользователе
  status: string;
  createdAt: string;
  updatedAt: string; // Например, "active" или "inactive"
}

// Типы для контекста
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string,
    status?: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

// Создание контекста
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Хранение данных пользователя
  const [token, setToken] = useState<string | null>(null); // Хранение токена
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Индикатор загрузки

  // Метод логина
  const login = async (email: string, password: string) => {
    try {
      const { token, refreshToken, user } = await apiLogin(email, password);

      // Сохранение токенов и данных пользователя
      localStorage.setItem("auth_token", token);
      localStorage.setItem("refresh_token", refreshToken);

      setToken(token);
      setUser(user);
    } catch (err: any) {
      console.error("Login failed:", err);

      // Очистка данных при ошибке
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");

      if (err.response?.status === 401) {
        throw new Error("Invalid credentials");
      } else {
        throw new Error("Unexpected error. Please try again.");
      }
    }
  };

  // Метод регистрации и автоматического логина
  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string,
    status?: string
  ) => {
    try {
      await axiosClient.post("/auth/register", { name, email, password, role, status });

      // Автоматический логин только для обычных пользователей
      if (!role && !status) {
        await login(email, password);
      }
    } catch (err: any) {
      console.error("Registration failed:", err);

      if (err.response?.status === 400 && err.response.data?.message) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error("An unexpected error occurred during registration.");
      }
    }
  };

  // Метод logout
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axiosClient.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Очистка данных локально
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      setToken(null);
      setUser(null);
    }
  };

  // Проверка токена и получение данных пользователя
  const checkAuth = async () => {
    try {
      const user = await verifyToken(); // Здесь возвращаются данные пользователя
      setUser(user);
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.warn("Unauthorized: Redirecting to login.");
        logout();
      } else {
        console.error("Failed to verify token:", err);
      }
    }
  };

  // Инициализация авторизации при загрузке приложения
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("auth_token");
      setIsAuthLoading(true);

      if (storedToken) {
        setToken(storedToken);
        try {
          await checkAuth();
        } catch {
          console.error("Failed to initialize auth.");
        } finally {
          setIsAuthLoading(false);
        }
      } else {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const isAuthenticated = !!token; // Пользователь авторизован, если токен есть

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Кастомный хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
