import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, ArrowRightLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { AccessDenied } from "@/components/AccessDenied";
import { rbacService } from "@/services/rbac.service";
import type {
  Gestionnaire,
  MatricePrerogatives,
  ModuleActivite,
  PassationDuree,
} from "@/services/types";

export const Route = createFileRoute("/admin/comptes")({
  component: ComptesPage,
});

const ALL_MODULES: ModuleActivite[] = [
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

function ComptesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user?.role !== "super-admin") {
    return <AccessDenied reason={t("admin.access.superAdminOnly")} />;
  }

  const [gestionnaires, setGestionnaires] = useState<Gestionnaire[]>([]);
  const [matrice, setMatrice] = useState<MatricePrerogatives | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showPassation, setShowPassation] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([rbacService.getGestionnaires(), rbacService.getMatriceDroits()])
      .then(([g, m]) => {
        if (!alive) return;
        setGestionnaires(g);
        setMatrice(m);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const toggleModule = async (g: Gestionnaire, m: ModuleActivite) => {
    const next = g.modules.includes(m)
      ? g.modules.filter((x) => x !== m)
      : [...g.modules, m];
    setSaving(g.id);
    try {
      await rbacService.assignerModules(g.id, next);
      setGestionnaires((prev) =>
        prev.map((x) => (x.id === g.id ? { ...x, modules: next } : x)),
      );
      toast.success(t("admin.comptes.savedModules", { name: g.fullName }));
    } catch {
      toast.error(t("admin.comptes.saveError"));
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("admin.comptes.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.comptes.subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowPassation(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
        >
          <ArrowRightLeft className="h-4 w-4" aria-hidden />
          {t("admin.comptes.passationCta")}
        </button>
      </div>

      {/* Matrice des prérogatives */}
      <section
        className="rounded-2xl bg-card p-5 border border-border"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-semibold text-foreground">
            {t("admin.comptes.matrice.title")}
          </h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("admin.comptes.matrice.desc")}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="text-start font-medium py-2 pe-3">
                  {t("admin.comptes.matrice.prerogative")}
                </th>
                <th className="text-center font-medium py-2 px-3">
                  {t("admin.role.superAdmin")}
                </th>
                <th className="text-center font-medium py-2 px-3">
                  {t("admin.role.gestionnaire")}
                </th>
              </tr>
            </thead>
            <tbody>
              {matrice?.prerogatives.map((p) => (
                <tr key={p.key} className="border-t border-border">
                  <td className="py-2 pe-3 text-foreground">
                    {t(`admin.comptes.prerogatives.${p.key}`)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <MatriceCell v={p.superAdmin} />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <MatriceCell v={p.gestionnaire} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Matrice des modules par gestionnaire */}
      <section
        className="rounded-2xl bg-card p-5 border border-border"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <h2 className="text-sm font-semibold text-foreground">
          {t("admin.comptes.modules.title")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("admin.comptes.modules.desc")}
        </p>

        {loading ? (
          <div className="mt-4 text-sm text-muted-foreground">{t("common.loading")}</div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="text-start font-medium py-2 pe-3 sticky start-0 bg-card">
                    {t("admin.comptes.modules.gestionnaire")}
                  </th>
                  {ALL_MODULES.map((m) => (
                    <th key={m} className="text-center font-medium py-2 px-2 whitespace-nowrap">
                      {t(`admin.modules.${m}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gestionnaires.map((g) => (
                  <tr key={g.id} className="border-t border-border">
                    <td className="py-2 pe-3 sticky start-0 bg-card">
                      <div className="font-medium text-foreground text-sm">{g.fullName}</div>
                      <div className="text-[11px] text-muted-foreground" dir="ltr">
                        {g.matricule}
                      </div>
                    </td>
                    {ALL_MODULES.map((m) => {
                      const on = g.modules.includes(m);
                      const busy = saving === g.id;
                      return (
                        <td key={m} className="py-2 px-2 text-center">
                          <label className="inline-flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-input accent-primary"
                              checked={on}
                              disabled={busy}
                              onChange={() => toggleModule(g, m)}
                              aria-label={`${g.fullName} — ${t(`admin.modules.${m}`)}`}
                            />
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showPassation && (
        <PassationModal
          gestionnaires={gestionnaires}
          onClose={() => setShowPassation(false)}
        />
      )}
    </div>
  );
}

function MatriceCell({ v }: { v: boolean | "attribues" }) {
  const { t } = useTranslation();
  if (v === true) {
    return (
      <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-700">
        <Check className="h-3.5 w-3.5" aria-hidden />
      </span>
    );
  }
  if (v === false) {
    return (
      <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-muted text-muted-foreground">
        <X className="h-3.5 w-3.5" aria-hidden />
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[11px] font-medium"
      title={t("admin.comptes.matrice.attribuesTip") ?? ""}
    >
      {t("admin.comptes.matrice.attribues")}
    </span>
  );
}

function PassationModal({
  gestionnaires,
  onClose,
}: {
  gestionnaires: Gestionnaire[];
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [fromId, setFromId] = useState<string>("");
  const [toId, setToId] = useState<string>("");
  const [duree, setDuree] = useState<PassationDuree>("15j");
  const [modules, setModules] = useState<ModuleActivite[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const from = gestionnaires.find((g) => g.id === fromId);
  const availableModules = from?.modules ?? [];

  const toggle = (m: ModuleActivite) => {
    setModules((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const canSubmit = fromId && toId && fromId !== toId && modules.length > 0 && !submitting;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await rbacService.passation({
        fromId,
        toId,
        modules,
        duree,
      });
      toast.success(t("admin.passation.success", { id: res.id }));
      onClose();
    } catch {
      toast.error(t("admin.passation.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="passation-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-card p-6"
        style={{ boxShadow: "var(--shadow-lift)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="passation-title" className="text-lg font-bold text-foreground">
          {t("admin.passation.title")}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{t("admin.passation.desc")}</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium">{t("admin.passation.from")}</label>
            <select
              value={fromId}
              onChange={(e) => {
                setFromId(e.target.value);
                setModules([]);
              }}
              className="mt-1.5 block w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {gestionnaires.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium">{t("admin.passation.to")}</label>
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {gestionnaires
                .filter((g) => g.id !== fromId)
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.fullName}
                  </option>
                ))}
            </select>
          </div>

          {from && (
            <div>
              <div className="text-xs font-medium">{t("admin.passation.modules")}</div>
              {availableModules.length === 0 ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("admin.passation.noModules")}
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableModules.map((m) => {
                    const on = modules.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggle(m)}
                        className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                          on
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:bg-secondary"
                        }`}
                      >
                        {t(`admin.modules.${m}`)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium">{t("admin.passation.duree")}</label>
            <select
              value={duree}
              onChange={(e) => setDuree(e.target.value as PassationDuree)}
              className="mt-1.5 block w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="7j">{t("admin.passation.d.7j")}</option>
              <option value="15j">{t("admin.passation.d.15j")}</option>
              <option value="30j">{t("admin.passation.d.30j")}</option>
              <option value="90j">{t("admin.passation.d.90j")}</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            {t("admin.passation.cancel")}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {submitting ? t("admin.passation.submitting") : t("admin.passation.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
