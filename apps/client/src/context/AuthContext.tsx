import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, verifyToken } from "../api/auth";
import axiosClient from "../api/axiosClient";
import { User } from "../utils/interfaces/IUser";
import { AuthContextType } from "../utils/interfaces/IAuthContextType";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]); 
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const { token, refreshToken, user } = await apiLogin(email, password);

      // Saving tokens and user data
      localStorage.setItem("auth_token", token);
      localStorage.setItem("refresh_token", refreshToken);

      setToken(token);
      setUser(user);
      setPermissions(user.permissions || []); 
    } catch (err: any) {
      console.error("Login failed:", err);

      // Clearing data on error
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");

      if (err.response?.status === 401) {
        throw new Error("Invalid credentials");
      } else {
        throw new Error("Unexpected error. Please try again.");
      }
    }
  };

  // Registration method
  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string,
    status?: string
  ) => {
    try {
      await axiosClient.post("/auth/register", { name, email, password, role, status });

      // Automatic login for regular users only
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

  // logout
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axiosClient.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      setToken(null);
      setUser(null);
      setPermissions([]);
      window.location.href = "/auth/login";
    }
  };

  
  // Verifying the token and getting user data
  const checkAuth = async () => {
    try {
      const user = await verifyToken();
      setUser(user);
      setPermissions(user.permissions || []); // Setting permissions
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.warn("Unauthorized: Redirecting to login.");
        logout();
      } else {
        console.error("Failed to verify token:", err);
      }
    }
  };

  // Checking permission
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  // Initializing authorization when loading the application
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

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        login,
        register,
        logout,
        isAuthenticated,
        isAuthLoading,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
