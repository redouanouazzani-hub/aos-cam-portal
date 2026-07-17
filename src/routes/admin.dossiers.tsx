import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Lock, PlayCircle, Inbox, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useRbac } from "@/lib/rbac-context";
import { dispatchService } from "@/services/dispatch.service";
import type { DispatchDossier, ModuleActivite } from "@/services/types";

export const Route = createFileRoute("/admin/dossiers")({
  component: DossiersQueuePage,
});

function DossiersQueuePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const { user } = useAuth();
  const { modules: myModules, loading: rbacLoading } = useRbac();
  const navigate = useNavigate();

  const [file, setFile] = useState<DispatchDossier[]>([]);
  const [parModule, setParModule] = useState<Partial<Record<ModuleActivite, number>>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await dispatchService.getFileAttente(user.id);
      setFile(res.dossiers);
      setParModule(res.parModule);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onNext = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      const d = await dispatchService.traiterSuivant(user.id);
      if (!d) {
        toast.info(t("admin.dispatch.emptyToast"));
        return;
      }
      toast.success(t("admin.dispatch.opened", { id: d.id }));
      await navigate({ to: "/admin/dossiers/$id", params: { id: String(d.id) } });
    } catch {
      toast.error(t("admin.dispatch.nextError"));
    } finally {
      setProcessing(false);
    }
  };

  const dateLocale = isAr ? "ar-MA" : "fr-FR";
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const isSA = user?.role === "super-admin";
  const attributedModules: ModuleActivite[] = isSA
    ? (Object.keys(parModule) as ModuleActivite[])
    : myModules;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("admin.dispatch.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.dispatch.subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={processing || rbacLoading || file.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <PlayCircle className="h-4 w-4" aria-hidden />
          )}
          {processing ? t("admin.dispatch.opening") : t("admin.dispatch.next")}
        </button>
      </div>

      {/* Compteurs par module attribué */}
      <section
        className="rounded-2xl bg-card p-5 border border-border"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <h2 className="text-sm font-semibold text-foreground">
          {t("admin.dispatch.compteurs")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {isSA ? t("admin.dispatch.compteursSA") : t("admin.dispatch.compteursGest")}
        </p>
        {rbacLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : attributedModules.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("admin.dashboard.aucunModule")}
          </p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {attributedModules.map((m) => {
              const c = parModule[m] ?? 0;
              return (
                <div
                  key={m}
                  className="rounded-xl border border-border bg-background/60 p-3"
                >
                  <div className="text-xs text-muted-foreground">
                    {t(`admin.modules.${m}`)}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-foreground">{c}</span>
                    <span className="text-xs text-muted-foreground">
                      {t("admin.dispatch.enAttente")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* File d'attente */}
      <section
        className="rounded-2xl bg-card border border-border overflow-hidden"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">
            {t("admin.dispatch.fileTitle")}
          </h2>
          <span className="text-xs text-muted-foreground">
            {t("admin.dispatch.count", { count: file.length })}
          </span>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">{t("common.loading")}</div>
        ) : file.length === 0 ? (
          <div className="p-10 text-center">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium text-foreground">
              {t("admin.dispatch.empty")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("admin.dispatch.emptyHint")}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {file.map((d) => {
              const locked = !!d.lockedBy;
              const label = isAr && d.prestation_ar ? d.prestation_ar : d.prestation;
              return (
                <li key={d.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[11px] font-mono text-muted-foreground"
                        dir="ltr"
                      >
                        #{d.id}
                      </span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {label}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium">
                        {t(`admin.modules.${d.module}`)}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {d.adherentNom}{" "}
                      <span className="text-muted-foreground/70" dir="ltr">
                        · {d.adherentMatricule}
                      </span>
                      <span className="mx-2">·</span>
                      {fmt(d.dateSoumission)}
                    </div>
                  </div>
                  {locked ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 text-[11px] font-medium"
                      title={t("admin.dispatch.lockedTip") ?? ""}
                    >
                      <Lock className="h-3 w-3" aria-hidden />
                      {t("admin.dispatch.lockedBy", { name: d.lockedBy!.fullName })}
                    </span>
                  ) : (
                    <Link
                      to="/admin/dossiers/$id"
                      params={{ id: String(d.id) }}
                      className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                    >
                      {t("admin.dispatch.open")}
                      <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        {t("admin.dispatch.antiCollisionHint")}
      </p>
    </div>
  );
}
