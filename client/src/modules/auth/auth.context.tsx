"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "./auth.service";
import type { AuthUser, LoginRequest, RegisterRequest } from "@/types/auth.types";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: LoginRequest) => Promise<AuthUser>;
  register: (payload: RegisterRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = "phone-store-auth-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (typeof window !== "undefined") {
        if (currentUser) {
          window.localStorage.setItem(storageKey, JSON.stringify(currentUser));
        } else {
          window.localStorage.removeItem(storageKey);
        }
      }
    } catch {
      setUser(null);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (!ignore) {
          setUser(currentUser);
          if (typeof window !== "undefined") {
            if (currentUser) {
              window.localStorage.setItem(
                storageKey,
                JSON.stringify(currentUser),
              );
            } else {
              window.localStorage.removeItem(storageKey);
            }
          }
        }
      })
      .catch(() => {
        if (!ignore) {
          setUser(null);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(storageKey);
          }
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(
    async (payload: LoginRequest) => {
      const loggedUser = await authService.login(payload);
      setUser(loggedUser);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(loggedUser));
      }
      return loggedUser;
    },
    [],
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const registeredUser = await authService.register(payload);
      setUser(registeredUser);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(registeredUser));
      }
      return registeredUser;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey);
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
