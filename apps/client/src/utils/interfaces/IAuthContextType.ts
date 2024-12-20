import { User } from "./IUser";

export interface AuthContextType {
    user: User | null;
    token: string | null;
    permissions: string[]; 
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
    hasPermission: (permission: string) => boolean; 
  }