import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FolderKanban, Megaphone, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRbac } from "@/lib/rbac-context";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { modules, loading } = useRbac();

  const kpis = [
    { key: "dossiersJour", icon: FolderKanban, value: 12, tone: "bg-primary/10 text-primary" },
    { key: "enInstruction", icon: Clock, value: 34, tone: "bg-amber-100 text-amber-700" },
    { key: "validesMois", icon: CheckCircle2, value: 87, tone: "bg-emerald-100 text-emerald-700" },
    { key: "campagnesActives", icon: Megaphone, value: 3, tone: "bg-sky-100 text-sky-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("admin.dashboard.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.dashboard.subtitle", { name: user?.fullName ?? "" })}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.key}
              className="rounded-2xl bg-card p-4 border border-border"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className={`inline-grid h-9 w-9 place-items-center rounded-xl ${k.tone}`}>
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </div>
              <div className="mt-3 text-2xl font-bold text-foreground">{k.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t(`admin.dashboard.kpi.${k.key}`)}
              </div>
            </div>
          );
        })}
      </div>

      {user?.role === "gestionnaire" && (
        <div
          className="rounded-2xl bg-card p-5 border border-border"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <h2 className="text-sm font-semibold text-foreground">
            {t("admin.dashboard.mesModules")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("admin.dashboard.mesModulesDesc")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {loading ? (
              <span className="text-xs text-muted-foreground">{t("common.loading")}</span>
            ) : modules.length === 0 ? (
              <span className="text-xs text-muted-foreground">
                {t("admin.dashboard.aucunModule")}
              </span>
            ) : (
              modules.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
                >
                  {t(`admin.modules.${m}`)}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/admin/dossiers"
          className="rounded-2xl bg-card p-5 border border-border hover:border-primary/50 transition-colors"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <FolderKanban className="h-6 w-6 text-primary" aria-hidden />
          <div className="mt-2 text-sm font-semibold">{t("admin.nav.dossiers")}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {t("admin.dashboard.linkDossiers")}
          </div>
        </Link>
        <Link
          to="/admin/campagnes"
          className="rounded-2xl bg-card p-5 border border-border hover:border-primary/50 transition-colors"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <Megaphone className="h-6 w-6 text-primary" aria-hidden />
          <div className="mt-2 text-sm font-semibold">{t("admin.nav.campagnes")}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {t("admin.dashboard.linkCampagnes")}
          </div>
        </Link>
      </div>
    </div>
  );
}
