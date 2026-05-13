import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "user" | "researcher" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  walletBalance: number;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const mockUsers: Record<UserRole, User> = {
  user: {
    id: "usr_0x7a3f",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "user",
    avatar: "",
    bio: "Health enthusiast sharing wearable data for science.",
    walletBalance: 2847.50,
    joinedDate: "2025-09-15",
  },
  researcher: {
    id: "res_0x9b2c",
    name: "Dr. Sarah Chen",
    email: "sarah@research.edu",
    role: "researcher",
    avatar: "",
    bio: "Cardiovascular researcher studying sleep patterns.",
    walletBalance: 15420.00,
    joinedDate: "2025-06-10",
  },
  admin: {
    id: "adm_0x1d4e",
    name: "Platform Admin",
    email: "admin@healthmarket.io",
    role: "admin",
    avatar: "",
    bio: "Platform administrator",
    walletBalance: 0,
    joinedDate: "2025-01-01",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (_email: string, _password: string) => {
    setUser(mockUsers.user);
  };

  const signup = (name: string, email: string, _password: string, role: UserRole) => {
    setUser({ ...mockUsers[role], name, email });
  };

  const logout = () => setUser(null);

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...mockUsers[role], name: user.name, email: user.email });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
