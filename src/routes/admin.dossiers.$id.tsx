import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MessageCircleWarning,
  Lock,
  Paperclip,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  CalendarClock,
  FileText,
  Ban,
  Wrench,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useRbac } from "@/lib/rbac-context";
import { AccessDenied } from "@/components/AccessDenied";
import { dispatchService } from "@/services/dispatch.service";
import { exceptionsService, type BlacklistState } from "@/services/exceptions.service";
import { STATUT_STYLES } from "@/lib/statut-styles";
import type { DispatchAction, DispatchDossier, ModuleActivite } from "@/services/types";

export const Route = createFileRoute("/admin/dossiers/$id")({
  component: InstructionPage,
});


function InstructionPage() {
  const { id } = Route.useParams();
  const dossierId = Number(id);
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const { user } = useAuth();
  const { canAccessModule, loading: rbacLoading } = useRbac();
  const navigate = useNavigate();

  const [dossier, setDossier] = useState<DispatchDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<DispatchAction | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [blacklist, setBlacklist] = useState<BlacklistState | null>(null);


  useEffect(() => {
    let alive = true;
    setLoading(true);
    dispatchService
      .getDossierById(dossierId)
      .then((d) => {
        if (!alive) return;
        setDossier(d);
        if (d) setBlacklist(exceptionsService.getBlacklistState(d.adherentMatricule));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [dossierId]);


  if (loading || rbacLoading) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <p className="text-sm text-muted-foreground">
          {t("admin.instruction.notFound")}
        </p>
        <Link
          to="/admin/dossiers"
          className="mt-4 inline-flex rounded-xl border border-border px-4 py-2 text-sm hover:bg-secondary"
        >
          {t("admin.instruction.back")}
        </Link>
      </div>
    );
  }

  // RBAC : le gestionnaire ne peut instruire que ses modules attribués.
  if (!canAccessModule(dossier.module)) {
    return <AccessDenied reason={t("admin.access.moduleNonAttribue")} />;
  }

  // Anti-collision : verrouillé par un autre gestionnaire
  if (dossier.lockedBy && dossier.lockedBy.userId !== user?.id) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <div
          className="rounded-3xl bg-card p-8 text-center"
          style={{ boxShadow: "var(--shadow-lift)" }}
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-700">
            <Lock className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="mt-4 text-xl font-bold text-foreground">
            {t("admin.instruction.lockedTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("admin.instruction.lockedBy", { name: dossier.lockedBy.fullName })}
          </p>
          <Link
            to="/admin/dossiers"
            className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
          >
            {t("admin.instruction.back")}
          </Link>
        </div>
      </div>
    );
  }

  const label = isAr && dossier.prestation_ar ? dossier.prestation_ar : dossier.prestation;
  const desc = isAr && dossier.description_ar ? dossier.description_ar : dossier.description;
  const statutStyle = STATUT_STYLES[dossier.statut];
  const dateLocale = isAr ? "ar-MA" : "fr-FR";
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const fmtMontant = (n: number, dev = "MAD") =>
    new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " " + dev;

  const onTransition = async (motif?: string) => {
    if (!user || !action) return;
    if ((action === "refuser" || action === "complement") && !motif?.trim()) return;
    setSubmitting(true);
    try {
      const res = await dispatchService.transitionDossier(
        dossier.id,
        action,
        motif,
        user.id,
      );
      const key =
        res.statut === "valide"
          ? "admin.instruction.toast.validated"
          : res.statut === "refuse"
            ? "admin.instruction.toast.refused"
            : "admin.instruction.toast.complement";
      toast.success(t(key, { id: dossier.id }));
      setAction(null);
      await navigate({ to: "/admin/dossiers" });
    } catch {
      toast.error(t("admin.instruction.toast.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <Link
          to="/admin/dossiers"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
          {t("admin.instruction.back")}
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground" dir="ltr">
                #{dossier.id}
              </span>
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-medium">
                {t(`admin.modules.${dossier.module}`)}
              </span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold text-foreground">
              {label}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {dossier.adherentNom}
              <span className="mx-2">·</span>
              <span dir="ltr">{dossier.adherentMatricule}</span>
              <span className="mx-2">·</span>
              {fmtDate(dossier.dateSoumission)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: statutStyle.bg, color: statutStyle.fg }}
            >
              {t(`dashboard.statut.${dossier.statut}`)}
            </span>
            {blacklist?.actif && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs font-semibold">
                <Ban className="h-3.5 w-3.5" aria-hidden />
                {t("admin.exception.blacklist.statusSuspended")}
              </span>
            )}
          </div>
        </div>
      </div>


      {/* Synthèse */}
      <section
        className="rounded-2xl bg-card p-5 border border-border"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <h2 className="text-sm font-semibold text-foreground">
          {t("admin.instruction.synthese")}
        </h2>
        {desc && <p className="mt-2 text-sm text-muted-foreground">{desc}</p>}

        {typeof dossier.montant === "number" && (
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="rounded-xl bg-background border border-border px-4 py-3">
              <div className="text-[11px] text-muted-foreground">
                {t("admin.instruction.montant")}
              </div>
              <div className="text-lg font-bold text-foreground" dir="ltr">
                {fmtMontant(dossier.montant, dossier.devise ?? "MAD")}
              </div>
            </div>
          </div>
        )}

        {dossier.echeancier && dossier.echeancier.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-semibold text-foreground">
              {t("admin.instruction.echeancier")}
            </h3>
            <div className="mt-2 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-start px-3 py-2 font-medium">
                      {t("admin.instruction.ech.n")}
                    </th>
                    <th className="text-start px-3 py-2 font-medium">
                      {t("admin.instruction.ech.date")}
                    </th>
                    <th className="text-end px-3 py-2 font-medium">
                      {t("admin.instruction.ech.montant")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dossier.echeancier.map((e) => (
                    <tr key={e.numero} className="border-t border-border">
                      <td className="px-3 py-2" dir="ltr">
                        {e.numero}
                      </td>
                      <td className="px-3 py-2" dir="ltr">
                        {fmtDate(e.date)}
                      </td>
                      <td className="px-3 py-2 text-end" dir="ltr">
                        {fmtMontant(e.montant, dossier.devise ?? "MAD")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {dossier.enfants && dossier.enfants.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-semibold text-foreground">
              {t("admin.instruction.enfants")}
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              {dossier.enfants.map((e, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-center gap-2 rounded-xl bg-background border border-border px-3 py-2"
                >
                  <span className="font-medium text-foreground">{e.prenom}</span>
                  <span className="text-xs text-muted-foreground">
                    · {t("admin.instruction.age", { age: e.age })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {isAr && e.niveau_ar ? e.niveau_ar : e.niveau}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {dossier.piecesJointes.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-semibold text-foreground">
              {t("admin.instruction.pieces")}
            </h3>
            <ul className="mt-2 space-y-1.5">
              {dossier.piecesJointes.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl bg-background border border-border px-3 py-2"
                >
                  <Paperclip className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  <span className="text-sm text-foreground" dir="ltr">
                    {isAr && p.nom_ar ? p.nom_ar : p.nom}
                  </span>
                  {p.filigraneServeur && (
                    <span className="ms-auto inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-medium">
                      {t("admin.instruction.filigrane")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Actions */}
      <section
        className="rounded-2xl bg-card p-5 border border-border"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <h2 className="text-sm font-semibold text-foreground">
          {t("admin.instruction.actions")}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAction("valider")}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {t("admin.instruction.valider")}
          </button>
          <button
            type="button"
            onClick={() => setAction("refuser")}
            className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:opacity-90"
          >
            <XCircle className="h-4 w-4" aria-hidden />
            {t("admin.instruction.refuser")}
          </button>
          <button
            type="button"
            onClick={() => setAction("complement")}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            <MessageCircleWarning className="h-4 w-4" aria-hidden />
            {t("admin.instruction.complement")}
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/20 p-3">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
          <p className="text-xs text-muted-foreground">
            {t("admin.instruction.auditHint", {
              user: user?.fullName ?? "",
              id: dossier.id,
            })}
          </p>
        </div>
      </section>

      {/* Pouvoirs d'exception (§4.7) */}
      <ExceptionsSection
        dossier={dossier}
        blacklist={blacklist}
        onBlacklistChange={setBlacklist}
        onRefuseCorrected={(id) => {
          // Le dossier repasse en Validé côté serveur ; on rafraîchit ici.
          setDossier((d) => (d ? { ...d, statut: "valide" } : d));
          toast.success(t("admin.exception.correction.success", { id }));
        }}
      />

      {action && (
        <ActionModal
          action={action}
          submitting={submitting}
          onCancel={() => setAction(null)}
          onConfirm={onTransition}
        />
      )}
    </div>
  );
}


function ActionModal({
  action,
  submitting,
  onCancel,
  onConfirm,
}: {
  action: DispatchAction;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: (motif?: string) => void;
}) {
  const { t } = useTranslation();
  const [motif, setMotif] = useState("");
  const requiresMotif = action === "refuser" || action === "complement";
  const canSubmit = !submitting && (!requiresMotif || motif.trim().length > 0);

  const titleKey =
    action === "valider"
      ? "admin.instruction.modal.validerTitle"
      : action === "refuser"
        ? "admin.instruction.modal.refuserTitle"
        : "admin.instruction.modal.complementTitle";

  const descKey =
    action === "valider"
      ? "admin.instruction.modal.validerDesc"
      : action === "refuser"
        ? "admin.instruction.modal.refuserDesc"
        : "admin.instruction.modal.complementDesc";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-card p-6"
        style={{ boxShadow: "var(--shadow-lift)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-foreground">{t(titleKey)}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t(descKey)}</p>

        {requiresMotif && (
          <div className="mt-4">
            <label className="block text-xs font-medium">
              {action === "refuser"
                ? t("admin.instruction.modal.motifRefus")
                : t("admin.instruction.modal.motifComplement")}
              <span className="text-destructive"> *</span>
            </label>
            <textarea
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              rows={4}
              placeholder={t("admin.instruction.modal.motifPlaceholder") ?? ""}
              className="mt-1.5 block w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            {motif.trim().length === 0 && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                {t("admin.instruction.modal.motifRequis")}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            {t("admin.instruction.modal.cancel")}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(motif.trim() || undefined)}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {t("admin.instruction.modal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// POUVOIRS D'EXCEPTION (§4.7)
// ------------------------------------------------------------
// Section réservée au gestionnaire attribué. Chaque action est
// journalisée côté serveur (login + timestamp + matricule + motif).
// Le front n'est qu'une interface : la sécurité et la traçabilité
// sont assurées PAR LARAVEL, jamais par le navigateur.
// ============================================================

type ExceptionKind =
  | "delegation"
  | "reouverture"
  | "saisieAdmin"
  | "blacklist"
  | "leverBlacklist"
  | "correction";

function ExceptionsSection({
  dossier,
  blacklist,
  onBlacklistChange,
  onRefuseCorrected,
}: {
  dossier: DispatchDossier;
  blacklist: BlacklistState | null;
  onBlacklistChange: (s: BlacklistState | null) => void;
  onRefuseCorrected: (id: number) => void;
}) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const { user } = useAuth();
  const [open, setOpen] = useState<ExceptionKind | null>(null);

  const dateLocale = isAr ? "ar-MA" : "fr-FR";
  const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleString(dateLocale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isRefuse = dossier.statut === "refuse";
  const isBlacklisted = !!blacklist?.actif;

  return (
    <section
      className="rounded-2xl bg-card p-5 border border-amber-200"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
          <ShieldAlert className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">
            {t("admin.exception.title")}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("admin.exception.lead")}
          </p>
        </div>
      </div>

      {/* Correction après refus — mis en avant si applicable */}
      {isRefuse && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <div className="flex items-start gap-2">
            <Wrench className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-emerald-900">
                {t("admin.exception.correction.title")}
              </h3>
              <p className="mt-1 text-xs text-emerald-900/80">
                {t("admin.exception.correction.lead")}
              </p>
              <button
                type="button"
                onClick={() => setOpen("correction")}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                {t("admin.exception.correction.submit")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grille des leviers */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <ExceptionButton
          icon={<UserCog className="h-4 w-4" aria-hidden />}
          label={t("admin.exception.delegation.button")}
          onClick={() => setOpen("delegation")}
        />
        <ExceptionButton
          icon={<CalendarClock className="h-4 w-4" aria-hidden />}
          label={t("admin.exception.reouverture.button")}
          onClick={() => setOpen("reouverture")}
        />
        <ExceptionButton
          icon={<FileText className="h-4 w-4" aria-hidden />}
          label={t("admin.exception.saisieAdmin.button")}
          onClick={() => setOpen("saisieAdmin")}
        />
        {isBlacklisted ? (
          <ExceptionButton
            icon={<Ban className="h-4 w-4" aria-hidden />}
            label={t("admin.exception.blacklist.buttonLift")}
            onClick={() => setOpen("leverBlacklist")}
            danger
          />
        ) : (
          <ExceptionButton
            icon={<Ban className="h-4 w-4" aria-hidden />}
            label={t("admin.exception.blacklist.button")}
            onClick={() => setOpen("blacklist")}
            danger
          />
        )}
      </div>

      {/* État blacklist */}
      <div className="mt-4 rounded-xl border border-border bg-background px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-foreground">
            {t("admin.exception.blacklist.sectionTitle")}
          </span>
          {isBlacklisted ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 text-destructive px-2.5 py-0.5 text-[11px] font-semibold">
              <Ban className="h-3 w-3" aria-hidden />
              {t("admin.exception.blacklist.statusSuspended")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-semibold">
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              {t("admin.exception.blacklist.statusActive")}
            </span>
          )}
        </div>
        {isBlacklisted && blacklist?.motif && (
          <p className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {t("admin.exception.blacklist.reasonLabel")}{" "}
            </span>
            {blacklist.motif}
            {blacklist.depuis && (
              <>
                <span className="mx-1.5">·</span>
                <span dir="ltr">
                  {t("admin.exception.blacklist.statusSuspendedSince", {
                    date: fmtDateTime(blacklist.depuis),
                  })}
                </span>
              </>
            )}
          </p>
        )}
      </div>

      {/* Bandeau audit + rappel serveur */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
        <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" aria-hidden />
        <div className="text-xs text-amber-900/90 space-y-1">
          <p>{t("admin.exception.auditBanner")}</p>
          <p className="text-amber-900/70">{t("admin.exception.serverEnforced")}</p>
        </div>
      </div>

      {/* Modales */}
      {open === "delegation" && (
        <DelegationModal
          dossier={dossier}
          onCancel={() => setOpen(null)}
          onDone={() => {
            toast.success(
              t("admin.exception.delegation.success", { name: dossier.adherentNom }),
            );
            setOpen(null);
          }}
        />
      )}
      {open === "reouverture" && (
        <ReouvertureModal
          defaultMatricule={dossier.adherentMatricule}
          module={dossier.module}
          gestionnaireId={user?.id ?? ""}
          onCancel={() => setOpen(null)}
          onDone={(matricule, fenetreJusqua) => {
            toast.success(
              t("admin.exception.reouverture.success", {
                matricule,
                date: fmtDateTime(fenetreJusqua),
              }),
            );
            setOpen(null);
          }}
        />
      )}
      {open === "saisieAdmin" && (
        <SaisieAdminModal
          defaultMatricule={dossier.adherentMatricule}
          module={dossier.module}
          gestionnaireId={user?.id ?? ""}
          onCancel={() => setOpen(null)}
          onDone={(id) => {
            toast.success(t("admin.exception.saisieAdmin.success", { id }));
            setOpen(null);
          }}
        />
      )}
      {open === "blacklist" && (
        <BlacklistModal
          matricule={dossier.adherentMatricule}
          name={dossier.adherentNom}
          gestionnaireId={user?.id ?? ""}
          onCancel={() => setOpen(null)}
          onDone={(state) => {
            onBlacklistChange(state);
            toast.success(
              t("admin.exception.blacklist.successBlock", { name: dossier.adherentNom }),
            );
            setOpen(null);
          }}
        />
      )}
      {open === "leverBlacklist" && (
        <LeverBlacklistModal
          matricule={dossier.adherentMatricule}
          name={dossier.adherentNom}
          onCancel={() => setOpen(null)}
          onDone={(state) => {
            onBlacklistChange(state);
            toast.success(
              t("admin.exception.blacklist.successLift", { name: dossier.adherentNom }),
            );
            setOpen(null);
          }}
        />
      )}
      {open === "correction" && (
        <CorrectionModal
          dossierId={dossier.id}
          gestionnaireId={user?.id ?? ""}
          onCancel={() => setOpen(null)}
          onDone={(id) => {
            onRefuseCorrected(id);
            setOpen(null);
          }}
        />
      )}
    </section>
  );
}

function ExceptionButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium text-start transition " +
        (danger
          ? "border-destructive/30 text-destructive hover:bg-destructive/5"
          : "border-border text-foreground hover:bg-secondary")
      }
    >
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0">{label}</span>
    </button>
  );
}

function ExceptionModalShell({
  title,
  description,
  warning,
  onCancel,
  children,
  submitLabel,
  onSubmit,
  submitting,
  canSubmit,
  submitClassName,
}: {
  title: string;
  description?: string;
  warning?: string;
  onCancel: () => void;
  children: React.ReactNode;
  submitLabel: string;
  onSubmit: () => void;
  submitting: boolean;
  canSubmit: boolean;
  submitClassName?: string;
}) {
  const { t } = useTranslation();
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-card p-6"
        style={{ boxShadow: "var(--shadow-lift)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        {warning && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" aria-hidden />
            <p className="text-xs text-amber-900">{warning}</p>
          </div>
        )}

        <div className="mt-4 space-y-3">{children}</div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/20 p-3">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
          <p className="text-xs text-muted-foreground">
            {t("admin.exception.auditBanner")}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            {t("admin.exception.cancel")}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className={
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 " +
              (submitClassName ?? "bg-primary hover:bg-primary-dark")
            }
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

const inputClass =
  "block w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function DelegationModal({
  dossier,
  onCancel,
  onDone,
}: {
  dossier: DispatchDossier;
  onCancel: () => void;
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [contenu, setContenu] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!contenu.trim() || !user) return;
    setSubmitting(true);
    try {
      await exceptionsService.delegationSaisie({
        dossierId: dossier.id,
        gestionnaireId: user.id,
        contenu: contenu.trim(),
      });
      onDone();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ExceptionModalShell
      title={t("admin.exception.delegation.title")}
      description={t("admin.exception.delegation.desc", {
        name: dossier.adherentNom,
        matricule: dossier.adherentMatricule,
      })}
      warning={t("admin.exception.delegation.warning", { name: dossier.adherentNom })}
      onCancel={onCancel}
      submitting={submitting}
      canSubmit={!submitting && contenu.trim().length > 0}
      onSubmit={submit}
      submitLabel={t("admin.exception.delegation.submit")}
    >
      <Field label={t("admin.exception.delegation.contenu")} required>
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          rows={4}
          placeholder={t("admin.exception.delegation.placeholder") ?? ""}
          className={inputClass + " resize-none"}
        />
      </Field>
    </ExceptionModalShell>
  );
}

function ReouvertureModal({
  defaultMatricule,
  module,
  gestionnaireId,
  onCancel,
  onDone,
}: {
  defaultMatricule: string;
  module: ModuleActivite;
  gestionnaireId: string;
  onCancel: () => void;
  onDone: (matricule: string, fenetreJusqua: string) => void;
}) {
  const { t } = useTranslation();
  const [matricule, setMatricule] = useState(defaultMatricule);
  const [activite, setActivite] = useState(String(module));
  const [duree, setDuree] = useState(24);
  const [motif, setMotif] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    !submitting &&
    matricule.trim().length > 0 &&
    activite.trim().length > 0 &&
    duree > 0 &&
    motif.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await exceptionsService.reouvertureTardive({
        matricule: matricule.trim(),
        activiteId: activite.trim(),
        dureeHeures: duree,
        motif: motif.trim(),
        gestionnaireId,
      });
      onDone(matricule.trim(), res.fenetreJusqua);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ExceptionModalShell
      title={t("admin.exception.reouverture.title")}
      description={t("admin.exception.reouverture.desc")}
      onCancel={onCancel}
      submitting={submitting}
      canSubmit={canSubmit}
      onSubmit={submit}
      submitLabel={t("admin.exception.reouverture.submit")}
    >
      <Field label={t("admin.exception.reouverture.matricule")} required>
        <input
          dir="ltr"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label={t("admin.exception.reouverture.activite")} required>
        <input
          value={activite}
          onChange={(e) => setActivite(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label={t("admin.exception.reouverture.duree")} required>
        <input
          dir="ltr"
          type="number"
          min={1}
          value={duree}
          onChange={(e) => setDuree(Number(e.target.value))}
          className={inputClass}
        />
      </Field>
      <Field label={t("admin.exception.reouverture.motif")} required>
        <textarea
          rows={3}
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          className={inputClass + " resize-none"}
        />
      </Field>
    </ExceptionModalShell>
  );
}

function SaisieAdminModal({
  defaultMatricule,
  module,
  gestionnaireId,
  onCancel,
  onDone,
}: {
  defaultMatricule: string;
  module: ModuleActivite;
  gestionnaireId: string;
  onCancel: () => void;
  onDone: (id: number) => void;
}) {
  const { t } = useTranslation();
  const [matricule, setMatricule] = useState(defaultMatricule);
  const [libelle, setLibelle] = useState("");
  const [montant, setMontant] = useState<string>("");
  const [motif, setMotif] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    !submitting &&
    matricule.trim().length > 0 &&
    libelle.trim().length > 0 &&
    motif.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await exceptionsService.saisieAdministrative({
        module: String(module),
        matricule: matricule.trim(),
        libelle: libelle.trim(),
        montant: montant ? Number(montant) : undefined,
        motif: motif.trim(),
        gestionnaireId,
      });
      onDone(res.id);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ExceptionModalShell
      title={t("admin.exception.saisieAdmin.title")}
      description={t("admin.exception.saisieAdmin.desc")}
      onCancel={onCancel}
      submitting={submitting}
      canSubmit={canSubmit}
      onSubmit={submit}
      submitLabel={t("admin.exception.saisieAdmin.submit")}
    >
      <Field label={t("admin.exception.saisieAdmin.module")}>
        <input value={String(module)} readOnly className={inputClass + " bg-muted"} />
      </Field>
      <Field label={t("admin.exception.saisieAdmin.matricule")} required>
        <input
          dir="ltr"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label={t("admin.exception.saisieAdmin.libelle")} required>
        <input
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label={t("admin.exception.saisieAdmin.montant")}>
        <input
          dir="ltr"
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label={t("admin.exception.saisieAdmin.motif")} required>
        <textarea
          rows={3}
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          className={inputClass + " resize-none"}
        />
      </Field>
    </ExceptionModalShell>
  );
}

function BlacklistModal({
  matricule,
  name,
  gestionnaireId,
  onCancel,
  onDone,
}: {
  matricule: string;
  name: string;
  gestionnaireId: string;
  onCancel: () => void;
  onDone: (s: BlacklistState) => void;
}) {
  const { t } = useTranslation();
  const [motif, setMotif] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = !submitting && motif.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const s = await exceptionsService.blacklist({
        matricule,
        motif: motif.trim(),
        gestionnaireId,
      });
      onDone(s);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ExceptionModalShell
      title={t("admin.exception.blacklist.title")}
      description={t("admin.exception.blacklist.desc", { name, matricule })}
      onCancel={onCancel}
      submitting={submitting}
      canSubmit={canSubmit}
      onSubmit={submit}
      submitLabel={t("admin.exception.blacklist.submit")}
      submitClassName="bg-destructive hover:opacity-90"
    >
      <Field label={t("admin.exception.blacklist.motif")} required>
        <textarea
          rows={3}
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          placeholder={t("admin.exception.blacklist.motifPlaceholder") ?? ""}
          className={inputClass + " resize-none"}
        />
      </Field>
    </ExceptionModalShell>
  );
}

function LeverBlacklistModal({
  matricule,
  name,
  onCancel,
  onDone,
}: {
  matricule: string;
  name: string;
  onCancel: () => void;
  onDone: (s: BlacklistState) => void;
}) {
  const { t } = useTranslation();
  const [motif, setMotif] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = !submitting && motif.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const s = await exceptionsService.leverBlacklist(matricule);
      onDone(s);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ExceptionModalShell
      title={t("admin.exception.blacklist.liftTitle")}
      description={t("admin.exception.blacklist.liftDesc", { name, matricule })}
      onCancel={onCancel}
      submitting={submitting}
      canSubmit={canSubmit}
      onSubmit={submit}
      submitLabel={t("admin.exception.blacklist.liftSubmit")}
    >
      <Field label={t("admin.exception.blacklist.liftMotif")} required>
        <textarea
          rows={3}
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          className={inputClass + " resize-none"}
        />
      </Field>
    </ExceptionModalShell>
  );
}

function CorrectionModal({
  dossierId,
  gestionnaireId,
  onCancel,
  onDone,
}: {
  dossierId: number;
  gestionnaireId: string;
  onCancel: () => void;
  onDone: (id: number) => void;
}) {
  const { t } = useTranslation();
  const [pieceNom, setPieceNom] = useState<string | undefined>();
  const [motif, setMotif] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = !submitting && motif.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await exceptionsService.corrigerApresRefus({
        dossierId,
        motifCorrection: motif.trim(),
        pieceJointeNom: pieceNom,
        gestionnaireId,
      });
      onDone(res.id);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ExceptionModalShell
      title={t("admin.exception.correction.title")}
      description={t("admin.exception.correction.lead")}
      onCancel={onCancel}
      submitting={submitting}
      canSubmit={canSubmit}
      onSubmit={submit}
      submitLabel={t("admin.exception.correction.submit")}
      submitClassName="bg-emerald-700 hover:bg-emerald-800"
    >
      <Field label={t("admin.exception.correction.piece")}>
        <label className="flex items-center gap-2 rounded-xl border border-dashed border-input bg-background px-3 py-2 text-sm cursor-pointer hover:bg-secondary">
          <Upload className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="min-w-0 truncate text-muted-foreground" dir="ltr">
            {pieceNom ?? t("admin.exception.correction.pieceHint")}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setPieceNom(e.target.files?.[0]?.name)}
          />
        </label>
      </Field>
      <Field label={t("admin.exception.correction.motif")} required>
        <textarea
          rows={3}
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          placeholder={t("admin.exception.correction.motifPlaceholder") ?? ""}
          className={inputClass + " resize-none"}
        />
      </Field>
    </ExceptionModalShell>
  );
}
