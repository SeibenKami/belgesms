"use client";

import { createContext, useContext, useCallback, useMemo, useSyncExternalStore, ReactNode } from "react";
import { Role } from "./role-context";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@belgesms.com",
    password: "admin123",
    role: "admin" as Role,
  },
  {
    id: "2",
    name: "Teacher User",
    email: "teacher@belgesms.com",
    password: "teacher123",
    role: "teacher" as Role,
  },
];

const STORAGE_KEY = "belgesms_user";

// External store helpers for useSyncExternalStore
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedUserJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const user = useMemo<User | null>(() => {
    if (!storedUserJson) return null;
    try {
      return JSON.parse(storedUserJson);
    } catch {
      return null;
    }
  }, [storedUserJson]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const userWithoutPassword = { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      emitChange();
      return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    emitChange();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
