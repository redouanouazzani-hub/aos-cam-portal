import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { type ReactNode } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";
import { LogOut } from "lucide-react";

interface NavItem {
  to: string;
  key: string;
}

export function AppShell({
  children,
  items,
  title,
}: {
  children: ReactNode;
  items: NavItem[];
  title: string;
}) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden md:flex md:w-64 flex-col border-e border-border bg-card">
        <div className="px-4 py-4 border-b border-border">
          <div className="text-sm font-semibold">{title}</div>
          {user && (
            <div className="mt-1 text-xs text-muted-foreground truncate">
              {user.fullName} · {t(`common.${user.role === "adherent" ? "member" : user.role === "gestionnaire" ? "manager" : "superAdmin"}`)}
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {items.map((it) => {
            const active = pathname === it.to || pathname.startsWith(it.to + "/");
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {t(it.key)}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← {t("common.backHome")}
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                {t("nav.logout")}
              </button>
            </div>
          </div>
          <nav className="md:hidden flex gap-1 overflow-x-auto px-2 pb-2">
            {items.map((it) => {
              const active = pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {t(it.key)}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 p-4 md:p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
