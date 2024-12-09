import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, verifyToken } from "../api/auth";
import axiosClient from "../api/axiosClient";

// Types for user data
interface User {
  id: string;
  role: string;
  email: string;
}

// Types for context
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string, status?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

// Creating context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Indicates whether auth is loading

  // Centralized login
  const login = async (email: string, password: string) => {
    try {
      const { token, refreshToken, user } = await apiLogin(email, password);
  
      // Saving tokens
      localStorage.setItem("auth_token", token);
      localStorage.setItem("refresh_token", refreshToken);
  
      // Status update
      setToken(token);
      setUser(user);
    } catch (err: any) {
      console.error("Login failed:", err);
  
      // Clearing tokens on error
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
  
      if (err.response?.status === 401) {
        throw new Error("Invalid credentials");
      } else {
        throw new Error("Unexpected error. Please try again.");
      }
    }
  };
  

  // Register and auto-login
  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string,
    status?: string
  ): Promise<void> => {
    try {
      await axiosClient.post("/auth/register", { name, email, password, role, status });
  
      // After successful registration, we perform automatic login only if role and status are not specified
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
  
  

  // Logout
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axiosClient.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear local data regardless of server success
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      setToken(null);
      setUser(null);
    }
  };

  // Verify token and fetch user
  const checkAuth = async () => {
    try {
      const user = await verifyToken();
      console.log("User verified:", user);
      setUser(user);
      setToken(localStorage.getItem("auth_token"));
    } catch (err) {
      console.error("Authorization check failed:", err);
      logout();
    }
  };

  // Initialize auth on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("auth_token");
      setIsAuthLoading(true);

      if (storedToken) {
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

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, register, isAuthenticated, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
