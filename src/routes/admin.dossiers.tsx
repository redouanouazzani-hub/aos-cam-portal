import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Lock, ArrowRight } from "lucide-react";
import { useRbac } from "@/lib/rbac-context";
import { useAuth } from "@/lib/auth-context";
import type { ModuleActivite } from "@/services/types";

export const Route = createFileRoute("/admin/dossiers")({
  component: DossiersPage,
});

const ALL: ModuleActivite[] = [
  "logement",
  "primes",
  "credits",
  "estivage",
  "scolarite",
  "voyages",
  "medical",
  "loisirs",
  "inwi",
];

// Compteurs factices par activité
const COUNTS: Record<ModuleActivite, number> = {
  logement: 6,
  primes: 11,
  credits: 18,
  estivage: 4,
  scolarite: 9,
  voyages: 2,
  medical: 7,
  loisirs: 1,
  inwi: 3,
};

function DossiersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { modules, canAccessModule, loading } = useRbac();
  const isSA = user?.role === "super-admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("admin.dossiers.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.dossiers.subtitle")}
        </p>
        {!isSA && !loading && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t("admin.dossiers.attributionHint", {
              count: modules.length,
            })}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ALL.map((m) => {
          const allowed = canAccessModule(m);
          return (
            <div
              key={m}
              className={`rounded-2xl bg-card p-4 border transition-colors ${
                allowed ? "border-border hover:border-primary/50" : "border-border/60 opacity-70"
              }`}
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {t(`admin.modules.${m}`)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t("admin.dossiers.pending", { count: COUNTS[m] })}
                  </div>
                </div>
                {allowed ? (
                  <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-1 text-[11px] font-medium">
                    {t("admin.dossiers.allowed")}
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2.5 py-1 text-[11px] font-medium"
                    title={t("admin.dossiers.restrictedTip") ?? ""}
                  >
                    <Lock className="h-3 w-3" aria-hidden />
                    {t("admin.dossiers.restricted")}
                  </span>
                )}
              </div>
              <button
                type="button"
                disabled={!allowed}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark disabled:cursor-not-allowed disabled:text-muted-foreground"
              >
                {allowed ? t("admin.dossiers.open") : t("admin.dossiers.locked")}
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
