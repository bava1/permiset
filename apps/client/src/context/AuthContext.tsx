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
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Creating context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  //Entrance
  const login = async (email: string, password: string) => {
    try {
      const { token, refreshToken, user } = await apiLogin(email, password);

      setToken(token);
      setUser(user);
      localStorage.setItem("auth_token", token); // Save the token
      localStorage.setItem("refresh_token", refreshToken); // Save refresh token
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Invalid credentials");
    }
  };
  
    // New method: registration
    const register = async (name: string, email: string, password: string): Promise<void> => {
      try {
        await axiosClient.post("/auth/register", { name, email, password });
    
        // After successful registration, we perform automatic login
        await login(email, password);
      } catch (err: any) {
        console.error("Registration failed:", err);
    
        // Return an error message instead of throwing it
        return Promise.reject(
          err.response?.data?.message || "An error occurred during registration"
        );
      }
    };
    

  // Token verification
  const checkAuth = async () => {
    try {
      const user = await verifyToken();
      setUser(user);
      setToken(localStorage.getItem("auth_token")); // Installing a token from localStorage
    } catch (err) {
      console.error("Authorization failed:", err);
      logout(); // Exit on invalid token
    }
  };

  // Exit
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
  
      // Send refreshToken to server for deletion
      await axiosClient.post("/auth/logout", { refreshToken });
  
      // Clearing client data
      setUser(null);
      setToken(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  
  


  // Checking authorization when loading an application and setting up a token refresh timer
useEffect(() => {
  const initializeAuth = async () => {
    const storedToken = localStorage.getItem("auth_token"); 
    const refreshToken = localStorage.getItem("refresh_token");

    if (storedToken) {
      await checkAuth();

      // Let's set a timer to automatically refresh the token
      const intervalId = setInterval(async () => {
        try {
          if (refreshToken) {
            await refreshAccessToken();
          }
        } catch (err) {
          console.error("Failed to refresh token:", err);
          clearInterval(intervalId); // Clearing the timer on error
          logout(); // Log out the user
        }
      }, 55 * 60 * 1000); // We refresh the token every 55 minutes

      // Clear timer on logout
      return () => clearInterval(intervalId);
    }

  };

  initializeAuth();
}, []);

  const isAuthenticated = !!token;

  const refreshAccessToken = async () => {
    try {
      const { data } = await axiosClient.post("/auth/refresh", {
        refreshToken: localStorage.getItem("refresh_token"),
      });
      setToken(data.access_token);
      localStorage.setItem("auth_token", data.access_token);
    } catch (err) {
      console.error("Unable to refresh token", err);
      logout();
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
