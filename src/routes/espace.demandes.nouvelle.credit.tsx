import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  GraduationCap,
  Home,
  Loader2,
  Paperclip,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { creditService } from "@/services/credit.service";
import { useAuth } from "@/lib/auth-context";
import type {
  CreditType,
  Echeancier,
  EncoursInfo,
  PrecompteMethode,
  PrimeAssurance,
} from "@/services/types";

export const Route = createFileRoute("/espace/demandes/nouvelle/credit")({
  component: NouveauCreditPage,
});

const TYPES: {
  value: CreditType;
  icon: typeof Wallet;
  labelKey: string;
  descKey: string;
}[] = [
  {
    value: "classique",
    icon: Wallet,
    labelKey: "credit.types.classique.label",
    descKey: "credit.types.classique.desc",
  },
  {
    value: "anglais",
    icon: GraduationCap,
    labelKey: "credit.types.anglais.label",
    descKey: "credit.types.anglais.desc",
  },
  {
    value: "auto",
    icon: ShieldCheck,
    labelKey: "credit.types.auto.label",
    descKey: "credit.types.auto.desc",
  },
  {
    value: "logement",
    icon: Home,
    labelKey: "credit.types.logement.label",
    descKey: "credit.types.logement.desc",
  },
];

function NouveauCreditPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step 1
  const [type, setType] = useState<CreditType | null>(null);

  // Step 2 state
  const [encours, setEncours] = useState<EncoursInfo | null>(null);
  const [prime, setPrime] = useState<PrimeAssurance | null>(null);
  const [pieceFile, setPieceFile] = useState<File | null>(null);

  // Step 3 state
  const [montant, setMontant] = useState<number | "">("");
  const [methode, setMethode] = useState<PrecompteMethode>("mensuelle");
  const [nbEcheances, setNbEcheances] = useState<number | "">("");
  const currentYm = new Date().toISOString().slice(0, 7);
  const [moisDebut, setMoisDebut] = useState<string>(currentYm);
  const [echeancier, setEcheancier] = useState<Echeancier | null>(null);

  // Step 4 state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    id: number;
    message: string;
  } | null>(null);

  // Load step 2 data based on type
  useEffect(() => {
    setPieceFile(null);
    setEncours(null);
    setPrime(null);
    if (!type) return;
    if (type === "classique") {
      creditService.getEncours().then(setEncours);
    } else if (type === "auto" && user) {
      creditService.getPrimeAssurance(user.matricule).then(setPrime);
    }
  }, [type, user]);

  // Live simulate step 3
  useEffect(() => {
    if (
      typeof montant !== "number" ||
      montant <= 0 ||
      typeof nbEcheances !== "number" ||
      nbEcheances <= 0 ||
      !moisDebut
    ) {
      setEcheancier(null);
      return;
    }
    let alive = true;
    creditService
      .simulerEcheancier({ montant, methode, nbEcheances, moisDebut })
      .then((r) => {
        if (alive) setEcheancier(r);
      });
    return () => {
      alive = false;
    };
  }, [montant, methode, nbEcheances, moisDebut]);

  const step2Valid = useMemo(() => {
    if (!type) return false;
    if (type === "classique") {
      if (!encours) return false;
      if (encours.actif && !pieceFile) return false;
      return true;
    }
    if (type === "anglais") return !!pieceFile;
    if (type === "auto") return !!prime;
    if (type === "logement") return !!pieceFile;
    return false;
  }, [type, encours, prime, pieceFile]);

  const step3Valid =
    typeof montant === "number" &&
    montant > 0 &&
    typeof nbEcheances === "number" &&
    nbEcheances > 0 &&
    !!moisDebut &&
    !!echeancier &&
    echeancier.lignes.length > 0;

  const dateLocale = isAr ? "ar-MA" : "fr-FR";
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const fmtMoney = (n: number, devise = "MAD") =>
    `${n.toLocaleString(dateLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${devise}`;

  const canNext =
    (step === 1 && !!type) ||
    (step === 2 && step2Valid) ||
    (step === 3 && step3Valid);

  async function handleSubmit() {
    if (submitting || !type || !echeancier) return;
    setSubmitting(true);
    try {
      const res = await creditService.soumettreCredit({
        type,
        echeancier: {
          montant: Number(montant),
          methode,
          nbEcheances: Number(nbEcheances),
          moisDebut,
        },
        primeAssurance: prime?.montant,
        pieceJointeNom: pieceFile?.name,
      });
      const msg = isAr
        ? res.autorisationPrecompte.message_ar
        : res.autorisationPrecompte.message;
      setSubmitted({ id: res.id, message: msg });
      toast.success(t("credit.submit.success", { id: res.id }));
    } catch {
      toast.error(t("credit.submit.error"));
      setSubmitting(false);
    }
  }

  const steps = [
    { n: 1, label: t("credit.steps.type") },
    { n: 2, label: t("credit.steps.pieces") },
    { n: 3, label: t("credit.steps.echeancier") },
    { n: 4, label: t("credit.steps.recap") },
  ];

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card
          className="rounded-2xl"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">
                {t("credit.done.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("credit.done.ref", { id: submitted.id })}
              </p>
            </div>
            <Alert className="text-start">
              <FileText className="h-4 w-4" aria-hidden />
              <AlertDescription>{submitted.message}</AlertDescription>
            </Alert>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Link
                to="/espace/demandes"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                {t("credit.done.backList")}
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

      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("credit.title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("credit.subtitle")}</p>
      </header>

      {/* Stepper */}
      <ol
        className="flex items-center gap-2 overflow-x-auto"
        aria-label={t("credit.stepperLabel")}
      >
        {steps.map((s, idx) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <li key={s.n} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                        ? "bg-primary/15 text-primary ring-2 ring-primary"
                        : "bg-secondary text-muted-foreground"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : s.n}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:inline ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="h-px flex-1 bg-border" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>

      <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                {t("credit.step1.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("credit.step1.subtitle")}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TYPES.map((tp) => {
                  const Icon = tp.icon;
                  const selected = type === tp.value;
                  return (
                    <button
                      key={tp.value}
                      type="button"
                      onClick={() => setType(tp.value)}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-start transition hover:bg-secondary/40 ${
                        selected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/40"
                          : "border-border bg-card"
                      }`}
                      aria-pressed={selected}
                    >
                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-primary"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground">
                          {t(tp.labelKey)}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {t(tp.descKey)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && type && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">
                {t("credit.step2.title")}
              </h2>

              {type === "classique" && (
                <div className="space-y-4">
                  {encours === null ? (
                    <p className="text-sm text-muted-foreground">
                      {t("common.loading")}
                    </p>
                  ) : encours.actif ? (
                    <>
                      <Alert
                        className="border-amber-200 bg-amber-50 text-amber-900"
                        style={{
                          borderColor:
                            "color-mix(in oklab, var(--accent) 40%, transparent)",
                          background:
                            "color-mix(in oklab, var(--accent) 12%, transparent)",
                        }}
                      >
                        <AlertTriangle className="h-4 w-4" aria-hidden />
                        <AlertDescription>
                          {t("credit.step2.classique.encoursActif", {
                            ref: encours.reference,
                          })}
                        </AlertDescription>
                      </Alert>
                      <FileUploadField
                        label={t("credit.step2.classique.derogation")}
                        hint={t("credit.step2.classique.derogationHint")}
                        file={pieceFile}
                        onChange={setPieceFile}
                        required
                      />
                    </>
                  ) : (
                    <Alert>
                      <ShieldCheck className="h-4 w-4" aria-hidden />
                      <AlertDescription>
                        {t("credit.step2.classique.aucunEncours")}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {type === "anglais" && (
                <FileUploadField
                  label={t("credit.step2.anglais.inscription")}
                  hint={t("credit.step2.anglais.inscriptionHint")}
                  file={pieceFile}
                  onChange={setPieceFile}
                  required
                />
              )}

              {type === "auto" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t("credit.step2.auto.subtitle")}
                  </p>
                  <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                    <div className="text-xs text-muted-foreground">
                      {t("credit.step2.auto.prime")}
                    </div>
                    {prime === null ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("common.loading")}
                      </p>
                    ) : (
                      <>
                        <div
                          className="mt-1 text-lg font-semibold"
                          dir="ltr"
                        >
                          {fmtMoney(prime.montant, prime.devise)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {prime.source}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {type === "logement" && (
                <FileUploadField
                  label={t("credit.step2.logement.projet")}
                  hint={t("credit.step2.logement.projetHint")}
                  file={pieceFile}
                  onChange={setPieceFile}
                  required
                />
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">
                {t("credit.step3.title")}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="montant">{t("credit.step3.montant")}</Label>
                  <Input
                    id="montant"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    dir="ltr"
                    value={montant}
                    onChange={(e) =>
                      setMontant(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("credit.step3.methode")}</Label>
                  <Select
                    value={methode}
                    onValueChange={(v) => setMethode(v as PrecompteMethode)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensuelle">
                        {t("credit.step3.mensuelle")}
                      </SelectItem>
                      <SelectItem value="semestrielle">
                        {t("credit.step3.semestrielle")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="nb">{t("credit.step3.nbEcheances")}</Label>
                  <Input
                    id="nb"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={120}
                    dir="ltr"
                    value={nbEcheances}
                    onChange={(e) =>
                      setNbEcheances(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    placeholder="24"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mois">{t("credit.step3.moisDebut")}</Label>
                  <Input
                    id="mois"
                    type="month"
                    dir="ltr"
                    value={moisDebut}
                    onChange={(e) => setMoisDebut(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  {t("credit.step3.tableau")}
                </h3>
                {echeancier && echeancier.lignes.length > 0 ? (
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/60 text-xs text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2 text-start font-medium">
                            {t("credit.step3.col.n")}
                          </th>
                          <th className="px-3 py-2 text-start font-medium">
                            {t("credit.step3.col.date")}
                          </th>
                          <th className="px-3 py-2 text-end font-medium">
                            {t("credit.step3.col.montant")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {echeancier.lignes.map((l) => (
                          <tr
                            key={l.numero}
                            className="border-t border-border/60"
                          >
                            <td className="px-3 py-2" dir="ltr">
                              {l.numero}
                            </td>
                            <td className="px-3 py-2">{fmtDate(l.date)}</td>
                            <td className="px-3 py-2 text-end" dir="ltr">
                              {fmtMoney(l.montant, echeancier.devise)}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-border bg-secondary/40 font-medium">
                          <td className="px-3 py-2" colSpan={2}>
                            {t("credit.step3.total")}
                          </td>
                          <td className="px-3 py-2 text-end" dir="ltr">
                            {fmtMoney(
                              echeancier.totalPrelevements,
                              echeancier.devise,
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("credit.step3.tableauEmpty")}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 4 && type && echeancier && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">
                {t("credit.step4.title")}
              </h2>

              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <RecapRow
                  label={t("credit.step4.type")}
                  value={t(`credit.types.${type}.label`)}
                />
                <RecapRow
                  label={t("credit.step3.methode")}
                  value={t(`credit.step3.${methode}`)}
                />
                <RecapRow
                  label={t("credit.step3.montant")}
                  value={fmtMoney(Number(montant), echeancier.devise)}
                  ltr
                />
                <RecapRow
                  label={t("credit.step3.nbEcheances")}
                  value={String(nbEcheances)}
                  ltr
                />
                <RecapRow
                  label={t("credit.step3.moisDebut")}
                  value={moisDebut}
                  ltr
                />
                {prime && type === "auto" && (
                  <RecapRow
                    label={t("credit.step2.auto.prime")}
                    value={fmtMoney(prime.montant, prime.devise)}
                    ltr
                  />
                )}
                {pieceFile && (
                  <RecapRow
                    label={t("credit.step4.piece")}
                    value={pieceFile.name}
                  />
                )}
              </dl>

              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="mb-2 text-xs font-medium text-muted-foreground">
                  {t("credit.step3.tableau")} ({echeancier.lignes.length})
                </div>
                <div
                  className="text-sm text-foreground"
                  dir="ltr"
                >
                  {t("credit.step3.total")} :{" "}
                  <span className="font-semibold">
                    {fmtMoney(
                      echeancier.totalPrelevements,
                      echeancier.devise,
                    )}
                  </span>
                </div>
              </div>

              <Alert>
                <FileText className="h-4 w-4" aria-hidden />
                <AlertDescription>
                  {t("credit.step4.autorisationHint")}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || submitting}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t("credit.nav.prev")}
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={!canNext}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("credit.nav.next")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {t("credit.nav.submitting")}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" aria-hidden />
                {t("credit.nav.submit")}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function RecapRow({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className="mt-0.5 text-sm font-medium text-foreground"
        dir={ltr ? "ltr" : undefined}
      >
        {value}
      </dd>
    </div>
  );
}

function FileUploadField({
  label,
  hint,
  file,
  onChange,
  required,
}: {
  label: string;
  hint?: string;
  file: File | null;
  onChange: (f: File | null) => void;
  required?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="ms-1 text-destructive">*</span>}
      </Label>
      <label
        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/30 p-4 text-sm transition hover:bg-secondary/50"
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Paperclip className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">
            {file ? file.name : t("credit.upload.choose")}
          </div>
          {hint && (
            <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
          )}
        </div>
        <input
          type="file"
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          accept="application/pdf,image/*"
        />
      </label>
    </div>
  );
}
