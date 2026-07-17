import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Baby,
  Loader2,
  Paperclip,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { primeService } from "@/services/prime.service";
import type { PrimeType } from "@/services/types";

export const Route = createFileRoute("/espace/demandes/nouvelle/prime")({
  component: NouvellePrimePage,
});

function NouvellePrimePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [type, setType] = useState<PrimeType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    reference: string;
    type: PrimeType;
  } | null>(null);

  const canSubmit = !!type && !!file && !submitting;

  async function handleSubmit() {
    if (!canSubmit || !type || !file) return;
    setSubmitting(true);
    try {
      const res = await primeService.soumettrePrime({
        type,
        justificatifNom: file.name,
      });
      setSubmitted({ reference: res.reference, type });
      toast.success(t("prime.submit.success", { ref: res.reference }));
    } catch {
      toast.error(t("prime.submit.error"));
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
              <h1 className="text-xl font-semibold">{t("prime.done.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("prime.done.ref", { ref: submitted.reference })}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(`prime.done.lead.${submitted.type}`)}
            </p>
            <div className="pt-2">
              <Link
                to="/espace/demandes"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                {t("prime.done.backList")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const types: {
    key: PrimeType;
    icon: typeof Heart;
    labelKey: string;
    descKey: string;
  }[] = [
    { key: "mariage", icon: Heart, labelKey: "prime.type.mariage", descKey: "prime.type.mariageDesc" },
    { key: "naissance", icon: Baby, labelKey: "prime.type.naissance", descKey: "prime.type.naissanceDesc" },
  ];

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
          <Heart className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("prime.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("prime.subtitle")}</p>
        </div>
      </header>

      <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t("prime.step.type")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {types.map((tp) => {
              const Icon = tp.icon;
              const active = type === tp.key;
              return (
                <button
                  key={tp.key}
                  type="button"
                  onClick={() => setType(tp.key)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-start transition ${
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                  aria-pressed={active}
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{t(tp.labelKey)}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {t(tp.descKey)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="space-y-4 p-6">
          <div>
            <h2 className="text-lg font-semibold">
              {t("prime.step.justificatif")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {type === "mariage"
                ? t("prime.justificatif.mariageHint")
                : type === "naissance"
                  ? t("prime.justificatif.naissanceHint")
                  : t("prime.justificatif.hint")}
            </p>
          </div>

          {file ? (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
              <Paperclip className="h-4 w-4 text-primary" aria-hidden />
              <span className="min-w-0 flex-1 truncate" dir="ltr">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                aria-label={t("prime.justificatif.retirer")}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-sm text-primary hover:bg-primary/10">
              <Paperclip className="h-4 w-4" aria-hidden />
              <span>{t("prime.justificatif.televerser")}</span>
              <input
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
              />
            </label>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t("prime.recap.title")}</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-secondary/50 px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                {t("prime.recap.type")}
              </dt>
              <dd className="font-medium">
                {type
                  ? t(`prime.type.${type}`)
                  : t("prime.recap.typeVide")}
              </dd>
            </div>
            <div className="rounded-xl bg-secondary/50 px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                {t("prime.recap.justificatif")}
              </dt>
              <dd className="truncate font-medium" dir="ltr">
                {file?.name ?? "—"}
              </dd>
            </div>
          </dl>

          {!file && (
            <Alert>
              <AlertDescription>
                {t("prime.recap.warnMissing")}
              </AlertDescription>
            </Alert>
          )}

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
              {submitting ? t("prime.submit.pending") : t("prime.submit.cta")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
