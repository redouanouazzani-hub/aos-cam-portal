import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Lock,
  Paperclip,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { scolariteService } from "@/services/scolarite.service";
import type { ScolariteEligibiliteResponse } from "@/services/types";

export const Route = createFileRoute("/espace/demandes/nouvelle/scolarite")({
  component: NouvelleScolaritePage,
});

function NouvelleScolaritePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const navigate = useNavigate();

  const dateRentree = useMemo(() => scolariteService.currentDateRentree(), []);
  const [data, setData] = useState<ScolariteEligibiliteResponse | null>(null);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [certificats, setCertificats] = useState<Record<number, File | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ id: number; reference: string } | null>(null);

  useEffect(() => {
    let alive = true;
    scolariteService.getEnfantsEligibles(dateRentree).then((r) => {
      if (alive) setData(r);
    });
    return () => {
      alive = false;
    };
  }, [dateRentree]);

  const dateLocale = isAr ? "ar-MA" : "fr-FR";
  const fmtDateLong = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const campagneFermee = data?.campagne.statut === "fermee";

  const selectedIds = Object.entries(selected)
    .filter(([, v]) => v)
    .map(([k]) => Number(k));

  const missingCertificat = selectedIds.some((id) => !certificats[id]);

  const canSubmit =
    !!data &&
    !campagneFermee &&
    selectedIds.length > 0 &&
    !missingCertificat &&
    !submitting;

  function toggleEnfant(id: number, enabled: boolean, value: boolean) {
    if (!enabled) return;
    setSelected((s) => ({ ...s, [id]: value }));
    if (!value) {
      setCertificats((c) => {
        const n = { ...c };
        delete n[id];
        return n;
      });
    }
  }

  async function handleSubmit() {
    if (!canSubmit || !data) return;
    setSubmitting(true);
    try {
      const res = await scolariteService.soumettreScolarite({
        dateRentree: data.campagne.dateRentree,
        enfants: selectedIds.map((id) => ({
          enfantId: id,
          certificatNom: certificats[id]?.name ?? "",
        })),
      });
      setSubmitted({ id: res.id, reference: res.reference });
      toast.success(t("scolarite.submit.success", { ref: res.reference }));
    } catch {
      toast.error(t("scolarite.submit.error"));
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-1">
        <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">{t("scolarite.done.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("scolarite.done.ref", { ref: submitted.reference })}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("scolarite.done.lead")}
            </p>
            <div className="pt-2">
              <Link
                to="/espace/demandes"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                {t("scolarite.done.backList")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/espace/demandes" })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t("demandes.detail.back")}
        </button>
      </div>

      <header className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <GraduationCap className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("scolarite.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("scolarite.subtitle")}
          </p>
        </div>
      </header>

      {/* Bandeau campagne */}
      {data && (
        <Card
          className="rounded-2xl"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <div
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{
                background: campagneFermee
                  ? "color-mix(in oklab, #dc2626 12%, transparent)"
                  : "color-mix(in oklab, var(--primary) 12%, transparent)",
                color: campagneFermee ? "#b91c1c" : "var(--primary)",
              }}
            >
              <CalendarClock className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">
                {campagneFermee
                  ? t("scolarite.campagne.fermeeTitle")
                  : t("scolarite.campagne.ouverteTitle")}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {t("scolarite.campagne.rentree", {
                  date: fmtDateLong(data.campagne.dateRentree),
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {campagneFermee && (
        <Alert
          style={{
            borderColor: "color-mix(in oklab, #dc2626 40%, transparent)",
            background: "color-mix(in oklab, #dc2626 8%, transparent)",
          }}
        >
          <Lock className="h-4 w-4" aria-hidden />
          <AlertDescription>{t("scolarite.campagne.fermeeDesc")}</AlertDescription>
        </Alert>
      )}

      {/* Règle d'âge */}
      <Alert>
        <ShieldCheck className="h-4 w-4" aria-hidden />
        <AlertDescription>{t("scolarite.rule")}</AlertDescription>
      </Alert>

      {/* Liste enfants */}
      <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t("scolarite.enfants.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("scolarite.enfants.subtitle")}
          </p>

          {!data ? (
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          ) : data.enfants.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" aria-hidden />
              <AlertDescription>
                {t("scolarite.enfants.aucun")}
              </AlertDescription>
            </Alert>
          ) : (
            <ul className="space-y-3">
              {data.enfants.map((e) => {
                const disabled = !e.eligible || campagneFermee;
                const isChecked = !!selected[e.id];
                const cert = certificats[e.id] ?? null;
                const raisonLabel = e.raison
                  ? t(`scolarite.enfants.raison.${e.raison}`)
                  : null;
                return (
                  <li
                    key={e.id}
                    className={`rounded-2xl border p-4 transition ${
                      disabled
                        ? "border-dashed border-border/70 bg-muted/40 opacity-70"
                        : isChecked
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`enfant-${e.id}`}
                        checked={isChecked}
                        disabled={disabled}
                        onCheckedChange={(v) =>
                          toggleEnfant(e.id, !disabled, v === true)
                        }
                        aria-describedby={
                          raisonLabel ? `enfant-${e.id}-raison` : undefined
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <label
                          htmlFor={`enfant-${e.id}`}
                          className={`text-sm font-medium ${
                            disabled
                              ? "text-muted-foreground"
                              : "text-foreground cursor-pointer"
                          }`}
                        >
                          {e.prenom} {e.nom}
                        </label>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {t("scolarite.enfants.ne", {
                            date: fmtDateLong(e.date_naissance),
                          })}{" "}
                          ·{" "}
                          {t("scolarite.enfants.age", {
                            years: e.ageAnnees.toFixed(1),
                          })}
                        </div>
                        {raisonLabel && (
                          <div
                            id={`enfant-${e.id}-raison`}
                            className="mt-1 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            <Lock className="h-3 w-3" aria-hidden />
                            {raisonLabel}
                          </div>
                        )}
                      </div>
                    </div>

                    {isChecked && !disabled && (
                      <div className="mt-4 space-y-2 ps-8">
                        <div className="text-xs font-medium text-foreground">
                          {t("scolarite.enfants.certificat")}
                        </div>
                        {cert ? (
                          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                            <Paperclip className="h-4 w-4 text-primary" aria-hidden />
                            <span className="min-w-0 flex-1 truncate" dir="ltr">
                              {cert.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setCertificats((c) => ({ ...c, [e.id]: null }))
                              }
                              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                              aria-label={t("scolarite.enfants.retirer")}
                            >
                              <X className="h-3.5 w-3.5" aria-hidden />
                            </button>
                          </div>
                        ) : (
                          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-sm text-primary hover:bg-primary/10">
                            <Paperclip className="h-4 w-4" aria-hidden />
                            <span>{t("scolarite.enfants.televerser")}</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,application/pdf"
                              onChange={(ev) => {
                                const f = ev.target.files?.[0] ?? null;
                                setCertificats((c) => ({ ...c, [e.id]: f }));
                              }}
                            />
                          </label>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {t("scolarite.enfants.certificatHint")}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Récap + soumission */}
      {data && !campagneFermee && (
        <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">
              {t("scolarite.recap.title")}
            </h2>
            {selectedIds.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("scolarite.recap.empty")}
              </p>
            ) : (
              <ul className="space-y-2">
                {selectedIds.map((id) => {
                  const e = data.enfants.find((x) => x.id === id);
                  const cert = certificats[id];
                  if (!e) return null;
                  return (
                    <li
                      key={id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-foreground">
                        {e.prenom} {e.nom}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs ${
                          cert ? "text-primary" : "text-destructive"
                        }`}
                      >
                        <Paperclip className="h-3.5 w-3.5" aria-hidden />
                        {cert
                          ? t("scolarite.recap.certificatOk")
                          : t("scolarite.recap.certificatManquant")}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border/60 pt-4">
              {missingCertificat && selectedIds.length > 0 && (
                <p className="text-xs text-destructive">
                  {t("scolarite.recap.warnMissing")}
                </p>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {submitting
                  ? t("scolarite.submit.pending")
                  : t("scolarite.submit.cta")}
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
