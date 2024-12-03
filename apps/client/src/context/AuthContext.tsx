import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, verifyToken } from "../api/auth";

// Типы для данных пользователя
interface User {
  id: string;
  role: string;
  email: string;
}

// Типы для контекста
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Создание контекста
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Вход
  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await apiLogin(email, password);

      setToken(token);
      setUser(user);
      localStorage.setItem("auth_token", token); // Сохраняем токен
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Invalid credentials");
    }
  };
  

  // Проверка токена
  const checkAuth = async () => {
    try {
      const user = await verifyToken();
      setUser(user);
      setToken(localStorage.getItem("auth_token")); // Устанавливаем токен из localStorage
    } catch (err) {
      console.error("Authorization failed:", err);
      logout(); // Выход при невалидном токене
    }
  };

  // Выход
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token"); // Удаляем токен из localStorage
  };

  // Проверка авторизации при загрузке приложения
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("auth_token");
      if (storedToken) {
        await checkAuth();
      }
    };
    initializeAuth();
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Пользовательский хук для использования AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
