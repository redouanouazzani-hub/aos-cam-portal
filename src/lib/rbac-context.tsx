import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { rbacService } from "@/services/rbac.service";
import type { ModuleActivite } from "@/services/types";

interface RbacContextValue {
  modules: ModuleActivite[];
  loading: boolean;
  canAccessModule: (m: ModuleActivite) => boolean;
}

const RbacContext = createContext<RbacContextValue | null>(null);

export function RbacProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [modules, setModules] = useState<ModuleActivite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (!user) {
      setModules([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    rbacService
      .getModulesAutorises(user.id)
      .then((m) => {
        if (alive) setModules(m);
      })
      .catch(() => {
        if (alive) setModules([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user]);

  const value: RbacContextValue = {
    modules,
    loading,
    canAccessModule: (m) => {
      if (!user) return false;
      if (user.role === "super-admin") return true;
      return modules.includes(m);
    },
  };
  return <RbacContext.Provider value={value}>{children}</RbacContext.Provider>;
}

export function useRbac() {
  const ctx = useContext(RbacContext);
  if (!ctx) throw new Error("useRbac must be used within RbacProvider");
  return ctx;
}
