import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  History,
  Paperclip,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { demandesService } from "@/services/demandes.service";
import type { DemandeDetail, DemandeStatut } from "@/services/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUT_STYLES } from "@/lib/statut-styles";

export const Route = createFileRoute("/espace/demandes/$id")({
  component: DemandeDetailPage,
});

function DemandeDetailPage() {
  const { id } = Route.useParams();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const navigate = useNavigate();
  const [data, setData] = useState<DemandeDetail | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    setData(undefined);
    demandesService.getDemandeById(Number(id)).then((d) => {
      if (alive) setData(d);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  const dateLocale = isAr ? "ar-MA" : "fr-FR";
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (data === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 rounded-md" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }
  if (data === null) {
    return (
      <div className="space-y-4">
        <Link to="/espace/demandes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t("demandes.detail.back")}
        </Link>
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            {t("demandes.detail.notFound")}
          </CardContent>
        </Card>
      </div>
    );
  }

  const prestation = isAr && data.prestation_ar ? data.prestation_ar : data.prestation;
  const description = isAr && data.description_ar ? data.description_ar : data.description;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/espace/demandes"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t("demandes.detail.back")}
        </Link>
      </div>

      <Card style={{ boxShadow: "var(--shadow-soft)" }} className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground" dir="ltr">
                #{data.id} · {fmtDate(data.date)}
              </div>
              <h1 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                {prestation}
              </h1>
              {description && (
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <StatutBadge statut={data.statut} />
          </div>
        </CardContent>
      </Card>

      <Timeline data={data} fmtDate={fmtDate} />

      {data.statut === "complement_demande" && (
        <ComplementBlock demandeId={data.id} onSubmitted={() => navigate({ to: "/espace/demandes" })} />
      )}

      <PiecesJointes data={data} fmtDate={fmtDate} isAr={isAr} />
      <Historique data={data} fmtDate={fmtDate} isAr={isAr} />
    </div>
  );
}

function StatutBadge({ statut }: { statut: DemandeStatut }) {
  const { t } = useTranslation();
  const s = STATUT_STYLES[statut];
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
      style={{ background: s.bg, color: s.fg }}
    >
      {t(`dashboard.statut.${statut}`)}
    </span>
  );
}

function Timeline({
  data,
  fmtDate,
}: {
  data: DemandeDetail;
  fmtDate: (s: string) => string;
}) {
  const { t } = useTranslation();
  return (
    <Card style={{ boxShadow: "var(--shadow-soft)" }} className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-primary" aria-hidden />
          {t("demandes.detail.timeline")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-4 ps-6">
          {/* rail */}
          <span
            aria-hidden
            className="absolute top-1 bottom-1 w-px bg-border start-2"
          />
          {data.timeline.map((step) => {
            const done = step.date !== null;
            const isCurrent = step.current;
            return (
              <li key={step.statut} className="relative">
                <span
                  aria-hidden
                  className="absolute top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border bg-background start-[-1.25rem]"
                  style={{
                    borderColor: isCurrent
                      ? "var(--primary)"
                      : done
                      ? "var(--primary)"
                      : "var(--border)",
                    background: isCurrent
                      ? "var(--primary)"
                      : done
                      ? "color-mix(in oklab, var(--primary) 20%, transparent)"
                      : "var(--background)",
                  }}
                >
                  {done && !isCurrent && (
                    <CheckCircle2 className="h-3 w-3 text-primary" aria-hidden />
                  )}
                  {!done && <Circle className="h-2 w-2 text-muted-foreground" aria-hidden />}
                </span>
                <div className={`text-sm font-medium ${isCurrent ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground"}`}>
                  {t(`dashboard.statut.${step.statut}`)}
                  {isCurrent && (
                    <span className="ms-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                      {t("demandes.detail.current")}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {step.date ? fmtDate(step.date) : t("demandes.detail.pending")}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

function PiecesJointes({
  data,
  fmtDate,
  isAr,
}: {
  data: DemandeDetail;
  fmtDate: (s: string) => string;
  isAr: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Card style={{ boxShadow: "var(--shadow-soft)" }} className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Paperclip className="h-4 w-4 text-primary" aria-hidden />
          {t("demandes.detail.pieces")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.piecesJointes.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("demandes.detail.piecesEmpty")}</p>
        ) : (
          <ul className="divide-y">
            {data.piecesJointes.map((p) => {
              const nom = isAr && p.nom_ar ? p.nom_ar : p.nom;
              return (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{nom}</div>
                      <div className="text-xs text-muted-foreground">{fmtDate(p.date)}</div>
                    </div>
                  </div>
                  {p.filigraneServeur && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
                      {t("demandes.detail.filigrane")}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function Historique({
  data,
  fmtDate,
  isAr,
}: {
  data: DemandeDetail;
  fmtDate: (s: string) => string;
  isAr: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Card style={{ boxShadow: "var(--shadow-soft)" }} className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4 text-primary" aria-hidden />
          {t("demandes.detail.history")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.historique.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("demandes.detail.historyEmpty")}</p>
        ) : (
          <ul className="space-y-3">
            {data.historique.map((h) => {
              const action = isAr && h.action_ar ? h.action_ar : h.action;
              return (
                <li key={h.id} className="rounded-xl border border-border/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm text-foreground">{action}</div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{fmtDate(h.date)}</div>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{h.auteur}</div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ComplementBlock({
  demandeId,
  onSubmitted,
}: {
  demandeId: number;
  onSubmitted: () => void;
}) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    if (!file) return;
    setSubmitting(true);
    // Mock: simule un appel API POST /me/demandes/:id/complements
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    toast.success(t("demandes.detail.complement.success", { id: demandeId }));
    onSubmitted();
  }

  return (
    <Card
      className="rounded-2xl border-primary/30"
      style={{ boxShadow: "var(--shadow-soft)", background: "color-mix(in oklab, var(--primary) 4%, var(--card))" }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Upload className="h-4 w-4 text-primary" aria-hidden />
          {t("demandes.detail.complement.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {t("demandes.detail.complement.description")}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-muted-foreground file:me-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/80"
        />
        {file && (
          <p className="text-xs text-muted-foreground">{file.name}</p>
        )}
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={!file || submitting}
            onClick={handleSubmit}
          >
            {submitting ? t("demandes.detail.complement.submitting") : t("demandes.detail.complement.submit")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
