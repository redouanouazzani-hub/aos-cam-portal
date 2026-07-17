import { Navigate } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import type { Role } from "@/services/types";
import { useTranslation } from "react-i18next";

export function RequireRole({
  roles,
  children,
  redirectTo = "/login",
}: {
  roles: Role[];
  children: ReactNode;
  redirectTo?: string;
}) {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} />;
  if (!roles.includes(user.role)) return <Navigate to={redirectTo} />;

  return <>{children}</>;
}
