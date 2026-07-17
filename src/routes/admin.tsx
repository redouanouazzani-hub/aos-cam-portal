import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LogOut, LayoutDashboard, FolderKanban, Megaphone, Users2, FileDown, ShieldCheck } from "lucide-react";
import { RequireRole } from "@/components/RequireRole";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RbacProvider } from "@/lib/rbac-context";
import { useAuth } from "@/lib/auth-context";
import type { Role } from "@/services/types";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

interface AdminNavItem {
  to: string;
  key: string;
  Icon: typeof LayoutDashboard;
  roles: Role[];
}

const NAV_ITEMS: AdminNavItem[] = [
  { to: "/admin/dashboard", key: "admin.nav.dashboard", Icon: LayoutDashboard, roles: ["gestionnaire", "super-admin"] },
  { to: "/admin/dossiers", key: "admin.nav.dossiers", Icon: FolderKanban, roles: ["gestionnaire", "super-admin"] },
  { to: "/admin/campagnes", key: "admin.nav.campagnes", Icon: Megaphone, roles: ["gestionnaire", "super-admin"] },
  { to: "/admin/comptes", key: "admin.nav.comptes", Icon: Users2, roles: ["super-admin"] },
  { to: "/admin/extraction", key: "admin.nav.extraction", Icon: FileDown, roles: ["super-admin"] },
  { to: "/admin/audit", key: "admin.nav.audit", Icon: ShieldCheck, roles: ["super-admin"] },
];

function AdminLayout() {
  return (
    <RequireRole roles={["gestionnaire", "super-admin"]} redirectTo="/admin-login">
      <RbacProvider>
        <AdminShell />
      </RbacProvider>
    </RequireRole>
  );
}

function AdminShell() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!user) return null;
  const items = NAV_ITEMS.filter((it) => it.roles.includes(user.role));
  const roleLabel =
    user.role === "super-admin" ? t("admin.role.superAdmin") : t("admin.role.gestionnaire");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden md:flex md:w-72 flex-col border-e border-border bg-card">
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
              A
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{t("admin.title")}</div>
              <div className="text-[11px] text-muted-foreground">{t("app.name")}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((it) => {
            const active = pathname === it.to || pathname.startsWith(it.to + "/");
            const Icon = it.Icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">{t(it.key)}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">{user.fullName}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                {roleLabel}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="hidden sm:inline text-xs text-muted-foreground hover:text-foreground">
                ← {t("common.backHome")}
              </Link>
              <LanguageSwitcher />
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{t("nav.logout")}</span>
              </button>
            </div>
          </div>

          <nav className="md:hidden flex gap-1 overflow-x-auto px-2 pb-2">
            {items.map((it) => {
              const active = pathname === it.to || pathname.startsWith(it.to + "/");
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs ${
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

        <main className="flex-1 p-4 md:p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
