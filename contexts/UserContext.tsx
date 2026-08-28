"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { DashboardUser } from "@/types/dashboard";

interface UserContextData {
  user: DashboardUser | null;
  setUser: (user: DashboardUser | null) => void;
  updateUser: (data: Partial<DashboardUser>) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
  initialUser: DashboardUser;
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
  const [user, setUser] = useState<DashboardUser | null>(initialUser);

  const updateUser = useCallback((data: Partial<DashboardUser>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      return {
        ...currentUser,
        ...data,
      };
    });
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      updateUser,
      clearUser,
    }),
    [user, updateUser, clearUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser utilizado dentro de um UserProvider.");
  }

  return context;
}
