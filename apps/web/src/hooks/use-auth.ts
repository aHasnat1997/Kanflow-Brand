"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@Kanflow-Brand/types";
import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister } from "@/lib/api/auth";
import { ApiClientError } from "@/lib/api/client";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
}

/**
 * Hook for authentication state and operations.
 * Calls `GET /auth/me` on mount to restore session from the httpOnly cookie.
 * Exposes login, logout, and register actions that update the local user state.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    getMe()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const res = await apiLogin(email, password);
      setUser(res.user);
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Login failed";
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const register = useCallback(
    async (email: string, name: string, password: string) => {
      setError(null);
      try {
        const res = await apiRegister(email, name, password);
        setUser(res.user);
      } catch (err) {
        const message = err instanceof ApiClientError ? err.message : "Registration failed";
        setError(message);
        throw err;
      }
    },
    [],
  );

  return { user, isLoading, error, login, logout, register };
}
