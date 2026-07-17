import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  FlaskConical,
  Loader2,
  Lock,
  MapPin,
  Sun,
  Timer,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { campagneService } from "@/services/campagne.service";
import { estivageService } from "@/services/estivage.service";
import { profileService } from "@/services/profile.service";
import { USE_MOCKS } from "@/services/http";
import type {
  Campagne,
  EstivageOptions,
  ProfileResponse,
} from "@/services/types";

export const Route = createFileRoute("/espace/demandes/nouvelle/estivage")({
  component: NouvelleEstivagePage,
});

function NouvelleEstivagePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const navigate = useNavigate();
  const dateLocale = isAr ? "ar-MA" : "fr-FR";

  // Horloge injectable : par défaut, l'horloge réelle. En mode mock, un
  // panneau démo permet de la simuler (voir plus bas). Rappel : côté
  // Laravel, `now` sera l'horloge SERVEUR — jamais celle du navigateur.
  const [simulatedNow, setSimulatedNow] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Re-render chaque seconde pour compte à rebours et bascule automatique
  // quand on approche de dateLimite (utile en démo comme en réel).
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const now = useMemo(() => {
    if (simulatedNow) {
      const d = new Date(simulatedNow);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return new Date();
    // tick force le recalcul chaque seconde
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulatedNow, tick]);

  const [campagne, setCampagne] = useState<Campagne | null>(null);
  const [options, setOptions] = useState<EstivageOptions | null>(null);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      campagneService.getCampagne("estivage", new Date()),
      estivageService.getOptions(),
      profileService.getProfile(),
    ]).then(([c, o, p]) => {
      if (!alive) return;
      setCampagne(c);
      setOptions(o);
      setProfile(p);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Recalcul du statut à chaque tick à partir des bornes stockées.
  const statut = useMemo(() => {
    if (!campagne) return null;
    return campagneService.computeStatut(
      campagne.dateOuverture,
      campagne.dateLimite,
      now,
    );
  }, [campagne, now]);

  const [centreId, setCentreId] = useState<string>("");
  const [periodeId, setPeriodeId] = useState<string>("");
  const [participants, setParticipants] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    id: number;
    reference: string;
  } | null>(null);

  const participantsList = useMemo(() => {
    if (!profile) return [];
    const list: Array<{ id: number; label: string; role: string }> = [];
    const a = profile.official.adherent;
    list.push({
      id: -1,
      label: `${a.prenom} ${a.nom}`,
      role: t("estivage.form.roleAdherent"),
    });
    const c = profile.declarative.conjoint;
    if (c && c.statut === "valide") {
      list.push({
        id: -2,
        label: `${c.prenom} ${c.nom}`,
        role: t("estivage.form.roleConjoint"),
      });
    }
    for (const e of profile.official.enfants) {
      list.push({
        id: e.id,
        label: `${e.prenom} ${e.nom}`,
        role: t("estivage.form.roleEnfant"),
      });
    }
    return list;
  }, [profile, t]);

  const selectedParticipants = Object.entries(participants)
    .filter(([, v]) => v)
    .map(([k]) => Number(k));

  const canSubmit =
    statut === "ouverte" &&
    !!centreId &&
    !!periodeId &&
    selectedParticipants.length > 0 &&
    !submitting;

  const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleString(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Compte à rebours jusqu'à dateLimite (recalculé à chaque tick via `now`).
  const countdown = useMemo(() => {
    if (!campagne || statut !== "ouverte") return null;
    const ms = new Date(campagne.dateLimite).getTime() - now.getTime();
    if (ms <= 0) return null;
    const s = Math.floor(ms / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    return { days, hours, minutes, seconds };
  }, [campagne, statut, now]);

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await estivageService.soumettreEstivage({
        centreId,
        periodeId,
        participants: selectedParticipants,
      });
      setSubmitted({ id: res.id, reference: res.reference });
      toast.success(t("estivage.submit.success", { ref: res.reference }));
    } catch {
      toast.error(t("estivage.submit.error"));
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
              <h1 className="text-xl font-semibold">
                {t("estivage.done.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("estivage.done.ref", { ref: submitted.reference })}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("estivage.done.lead")}
            </p>
            <Link
              to="/espace/demandes"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {t("estivage.done.backList")}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bandeauStatut =
    statut === "a_venir"
      ? {
          title: t("estivage.campagne.aVenirTitle"),
          desc: campagne
            ? t("estivage.campagne.aVenirDesc", {
                date: fmtDateTime(campagne.dateOuverture),
              })
            : "",
          tone: "amber" as const,
          icon: <CalendarClock className="h-4 w-4" aria-hidden />,
        }
      : statut === "fermee"
        ? {
            title: t("estivage.campagne.fermeeTitle"),
            desc: campagne
              ? t("estivage.campagne.fermeeDesc", {
                  date: fmtDateTime(campagne.dateLimite),
                })
              : "",
            tone: "red" as const,
            icon: <Lock className="h-4 w-4" aria-hidden />,
          }
        : {
            title: t("estivage.campagne.ouverteTitle"),
            desc: campagne
              ? t("estivage.campagne.ouverteDesc", {
                  date: fmtDateTime(campagne.dateLimite),
                })
              : "",
            tone: "primary" as const,
            icon: <Sun className="h-4 w-4" aria-hidden />,
          };

  const toneBg =
    bandeauStatut.tone === "red"
      ? "color-mix(in oklab, #dc2626 12%, transparent)"
      : bandeauStatut.tone === "amber"
        ? "color-mix(in oklab, #d97706 15%, transparent)"
        : "color-mix(in oklab, var(--primary) 12%, transparent)";
  const toneFg =
    bandeauStatut.tone === "red"
      ? "#b91c1c"
      : bandeauStatut.tone === "amber"
        ? "#b45309"
        : "var(--primary)";

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
          <Sun className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("estivage.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("estivage.subtitle")}
          </p>
        </div>
      </header>

      {/* Démo — bascule d'horloge (visible uniquement en mode mock) */}
      {USE_MOCKS && campagne && (
        <Card
          className="rounded-2xl border-dashed"
          style={{
            boxShadow: "var(--shadow-soft)",
            borderColor: "color-mix(in oklab, var(--primary) 30%, transparent)",
            background:
              "color-mix(in oklab, var(--primary) 4%, transparent)",
          }}
        >
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start gap-2">
              <FlaskConical
                className="mt-0.5 h-4 w-4 text-primary"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">
                  {t("estivage.demo.title")}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("estivage.demo.hint")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
              <Input
                type="datetime-local"
                value={simulatedNow ?? ""}
                onChange={(e) => setSimulatedNow(e.target.value || null)}
                aria-label={t("estivage.demo.inputLabel")}
              />
              <button
                type="button"
                onClick={() =>
                  setSimulatedNow(
                    toDatetimeLocal(new Date(campagne.dateOuverture)),
                  )
                }
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/60"
              >
                {t("estivage.demo.jumpOpening")}
              </button>
              <button
                type="button"
                onClick={() =>
                  setSimulatedNow(
                    toDatetimeLocal(
                      new Date(
                        new Date(campagne.dateLimite).getTime() + 1000,
                      ),
                    ),
                  )
                }
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/60"
              >
                {t("estivage.demo.jumpAfterLimit")}
              </button>
              <button
                type="button"
                onClick={() => setSimulatedNow(null)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/60"
              >
                {t("estivage.demo.reset")}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {t("estivage.demo.now", {
                value: fmtDateTime(now.toISOString()),
              })}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Bandeau campagne */}
      {campagne && (
        <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <div
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{ background: toneBg, color: toneFg }}
            >
              {bandeauStatut.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">
                {bandeauStatut.title}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {bandeauStatut.desc}
              </div>
            </div>
            {statut === "ouverte" && countdown && (
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{ background: toneBg, color: toneFg }}
                dir="ltr"
                aria-label={t("estivage.countdown.aria")}
              >
                <Timer className="h-3.5 w-3.5" aria-hidden />
                {t("estivage.countdown.value", {
                  d: countdown.days,
                  h: String(countdown.hours).padStart(2, "0"),
                  m: String(countdown.minutes).padStart(2, "0"),
                  s: String(countdown.seconds).padStart(2, "0"),
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* À VENIR */}
      {statut === "a_venir" && (
        <Alert>
          <CalendarClock className="h-4 w-4" aria-hidden />
          <AlertDescription>{t("estivage.campagne.aVenirLead")}</AlertDescription>
        </Alert>
      )}

      {/* FERMÉE */}
      {statut === "fermee" && (
        <Alert
          style={{
            borderColor: "color-mix(in oklab, #dc2626 40%, transparent)",
            background: "color-mix(in oklab, #dc2626 8%, transparent)",
          }}
        >
          <Lock className="h-4 w-4" aria-hidden />
          <AlertDescription>{t("estivage.campagne.fermeeLead")}</AlertDescription>
        </Alert>
      )}

      {/* FORMULAIRE — visible uniquement si ouverte (masqué si à venir,
          désactivé si fermée). */}
      {statut !== "a_venir" && (
        <fieldset
          disabled={statut === "fermee" || submitting}
          className="space-y-6 disabled:opacity-60"
        >
          {/* Centre */}
          <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden />
                <h2 className="text-lg font-semibold">
                  {t("estivage.form.centreTitle")}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {options?.centres.map((c) => {
                  const active = centreId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCentreId(c.id)}
                      className={`rounded-2xl border p-3 text-start transition ${
                        active
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-secondary/40"
                      }`}
                    >
                      <div className="text-sm font-medium text-foreground">
                        {isAr && c.nom_ar ? c.nom_ar : c.nom}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {c.ville}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Période */}
          <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" aria-hidden />
                <h2 className="text-lg font-semibold">
                  {t("estivage.form.periodeTitle")}
                </h2>
              </div>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {options?.periodes.map((p) => {
                  const active = periodeId === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setPeriodeId(p.id)}
                        className={`w-full rounded-2xl border p-3 text-start transition ${
                          active
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:bg-secondary/40"
                        }`}
                      >
                        <div className="text-sm font-medium text-foreground">
                          {fmtDate(p.debut)} → {fmtDate(p.fin)}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" aria-hidden />
                <h2 className="text-lg font-semibold">
                  {t("estivage.form.participantsTitle")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("estivage.form.participantsHint")}
              </p>
              <ul className="space-y-2">
                {participantsList.map((p) => {
                  const checked = !!participants[p.id];
                  return (
                    <li
                      key={p.id}
                      className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                        checked
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <Checkbox
                        id={`part-${p.id}`}
                        checked={checked}
                        onCheckedChange={(v) =>
                          setParticipants((s) => ({
                            ...s,
                            [p.id]: v === true,
                          }))
                        }
                      />
                      <label
                        htmlFor={`part-${p.id}`}
                        className="min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="text-sm font-medium text-foreground">
                          {p.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {p.role}
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border/60 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              )}
              {submitting
                ? t("estivage.submit.pending")
                : t("estivage.submit.cta")}
            </button>
          </div>
        </fieldset>
      )}
    </div>
  );
}

// Convertit une Date vers la valeur attendue par <input type="datetime-local">.
function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
