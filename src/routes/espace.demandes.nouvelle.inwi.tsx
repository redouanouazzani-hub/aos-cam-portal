import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Loader2,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { inwiService } from "@/services/inwi.service";
import type { InwiForfait, InwiMode } from "@/services/types";

export const Route = createFileRoute("/espace/demandes/nouvelle/inwi")({
  component: NouvelleInwiPage,
});

function NouvelleInwiPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const navigate = useNavigate();

  const [forfaits, setForfaits] = useState<InwiForfait[] | null>(null);
  const [forfaitId, setForfaitId] = useState<string | null>(null);
  const [mode, setMode] = useState<InwiMode>("nouvelle_ligne");
  const [numero, setNumero] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ reference: string } | null>(null);

  useEffect(() => {
    let alive = true;
    inwiService.getForfaits().then((r) => {
      if (alive) setForfaits(r.forfaits);
    });
    return () => {
      alive = false;
    };
  }, []);

  const numeroValide =
    mode !== "portabilite" || /^0[567]\d{8}$/.test(numero.trim());

  const canSubmit = !!forfaitId && numeroValide && !submitting;

  async function handleSubmit() {
    if (!canSubmit || !forfaitId) return;
    setSubmitting(true);
    try {
      const res = await inwiService.soumettreInwi({
        forfaitId,
        mode,
        numeroPortabilite:
          mode === "portabilite" ? numero.trim() : undefined,
      });
      setSubmitted({ reference: res.reference });
      toast.success(t("inwi.submit.success", { ref: res.reference }));
    } catch {
      toast.error(t("inwi.submit.error"));
      setSubmitting(false);
    }
  }

  const selectedForfait = forfaits?.find((f) => f.id === forfaitId) ?? null;
  const fmtMoney = (n: number, devise: string) =>
    `${new Intl.NumberFormat(isAr ? "ar-MA" : "fr-FR", {
      maximumFractionDigits: 0,
    }).format(n)} ${devise}`;

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-1">
        <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">{t("inwi.done.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("inwi.done.ref", { ref: submitted.reference })}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("inwi.done.lead")}
            </p>
            <div className="pt-2">
              <Link
                to="/espace/demandes"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                {t("inwi.done.backList")}
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
          <Smartphone className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("inwi.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("inwi.subtitle")}</p>
        </div>
      </header>

      <Alert>
        <Info className="h-4 w-4" aria-hidden />
        <AlertDescription>{t("inwi.noDocs")}</AlertDescription>
      </Alert>

      <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t("inwi.step.forfait")}</h2>
          {!forfaits ? (
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {forfaits.map((f) => {
                const active = forfaitId === f.id;
                const libelle = isAr && f.libelle_ar ? f.libelle_ar : f.libelle;
                const desc =
                  isAr && f.description_ar ? f.description_ar : f.description;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setForfaitId(f.id)}
                    className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-start transition ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-secondary/40"
                    }`}
                    aria-pressed={active}
                  >
                    <div className="flex w-full items-baseline justify-between gap-2">
                      <span className="text-sm font-medium">{libelle}</span>
                      <span className="text-sm font-semibold text-primary">
                        {fmtMoney(f.prix, f.devise)}
                      </span>
                    </div>
                    {desc && (
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t("inwi.step.mode")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["nouvelle_ligne", "portabilite"] as InwiMode[]).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-2xl border p-4 text-start transition ${
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                  aria-pressed={active}
                >
                  <div className="text-sm font-medium">
                    {t(`inwi.mode.${m}`)}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {t(`inwi.mode.${m}Desc`)}
                  </div>
                </button>
              );
            })}
          </div>

          {mode === "portabilite" && (
            <div className="space-y-1.5">
              <label
                htmlFor="numero-porta"
                className="text-sm font-medium text-foreground"
              >
                {t("inwi.portabilite.label")}
              </label>
              <Input
                id="numero-porta"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="06XXXXXXXX"
                dir="ltr"
                inputMode="tel"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                {t("inwi.portabilite.hint")}
              </p>
              {numero && !numeroValide && (
                <p className="text-xs text-destructive">
                  {t("inwi.portabilite.invalide")}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t("inwi.recap.title")}</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-secondary/50 px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                {t("inwi.recap.forfait")}
              </dt>
              <dd className="font-medium">
                {selectedForfait
                  ? isAr && selectedForfait.libelle_ar
                    ? selectedForfait.libelle_ar
                    : selectedForfait.libelle
                  : "—"}
              </dd>
            </div>
            <div className="rounded-xl bg-secondary/50 px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                {t("inwi.recap.mode")}
              </dt>
              <dd className="font-medium">{t(`inwi.mode.${mode}`)}</dd>
            </div>
            {mode === "portabilite" && (
              <div className="rounded-xl bg-secondary/50 px-3 py-2 sm:col-span-2">
                <dt className="text-xs text-muted-foreground">
                  {t("inwi.recap.numero")}
                </dt>
                <dd className="font-medium" dir="ltr">
                  {numero || "—"}
                </dd>
              </div>
            )}
          </dl>

          <div className="flex justify-end border-t border-border/60 pt-4">
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
              {submitting ? t("inwi.submit.pending") : t("inwi.submit.cta")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
