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
  const tokenRef = useRef<string | null>(null); 

  // ✅ Login
  const login = async (email: string, password: string) => {
    try {
      const { token, refreshToken, user } = await apiLogin(email, password);
      // if (!token) throw new Error("❌The server did not return the token! ");

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
      console.error("❌Login error: ", err);
    }
  };

  // ✅Register (to remove `missing register` error)
  const register = async (name: string, email: string, password: string, role?: string, status?: string) => {
    try {
      await axiosClient.post("/auth/register", { name, email, password, role, status });
      if (!role && !status) await login(email, password);
    } catch (err: any) {
      console.error("❌Registration error: ", err);
      throw new Error(err.response?.data?.message || "Registration error.");
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
      }
    } catch (err) {
      console.error("❌ Exit Error:", err);
    } finally {
      tokenRef.current = null;
      setToken(null);
      setUser(null);
      setPermissions([]);
      router.replace("/auth/login");
    }
  };

  // ✅ Checking permissions (to remove `missing hasPermission` error)
  const hasPermission = (permission: string): boolean => permissions.includes(permission);

  // ✅ Now the token is loaded when changing the language
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      console.log("🔹 useEffect started. Token found:", storedToken);
  
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
          console.warn("⚠️ Token verification error, but logout is NOT executed.");
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
