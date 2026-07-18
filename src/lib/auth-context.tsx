import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "@/services/auth.service";
import { getToken } from "@/services/http";
import type { AuthUser, LoginPayload, Role } from "@/services/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  activate: (password: string) => Promise<AuthUser>;
  hasRole: (roles: Role | Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const u = await authService.me();
        if (alive) setUser(u);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    login: async (payload) => {
      const res = await authService.login(payload);
      const u: AuthUser = { ...res.user, doit_activer: res.doit_activer ?? res.user.doit_activer };
      setUser(u);
      return u;
    },
    logout: async () => {
      await authService.logout();
      setUser(null);
    },
    activate: async (password) => {
      const u = await authService.activate(password);
      setUser(u);
      return u;
    },
    hasRole: (roles) => {
      if (!user) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.includes(user.role);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
