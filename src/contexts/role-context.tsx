"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./auth-context";

export type Role = "admin" | "teacher";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [role, setRole] = useState<Role>(user?.role || "admin");

  // Sync role with authenticated user
  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user?.role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
