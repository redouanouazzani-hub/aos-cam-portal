import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ClipboardList,
  CheckCircle2,
  BellRing,
  CalendarClock,
  ArrowRight,
  FileText,
  Bell,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { dashboardService } from "@/services/dashboard.service";
import type {
  DashboardSummary,
  DemandeStatut,
  DemandeRecente,
  NotificationRecente,
  Echeance,
} from "@/services/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUT_STYLES } from "@/lib/statut-styles";

export const Route = createFileRoute("/espace/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const { user } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    dashboardService.getDashboardSummary().then((d) => {
      if (!alive) return;
      setData(d);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const dateLocale = isAr ? "ar-MA" : "fr-FR";
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const fmtDateShort = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      day: "numeric",
      month: "long",
    });
  const fmtMoney = (v: number, devise: string) =>
    `${new Intl.NumberFormat(dateLocale).format(v)} ${devise}`;

  const firstName = user?.fullName?.split(" ")[0] ?? "";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("dashboard.greeting", { name: firstName })}
        </h1>
        <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
      </header>

      {loading || !data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((k) => (
              <Skeleton key={k} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon={ClipboardList}
              label={t("dashboard.kpi.enCours")}
              value={String(data.kpis.demandesEnCours)}
              tone="primary"
            />
            <KpiCard
              icon={CheckCircle2}
              label={t("dashboard.kpi.validees")}
              value={String(data.kpis.demandesValidees)}
              tone="success"
            />
            <KpiCard
              icon={BellRing}
              label={t("dashboard.kpi.notifications")}
              value={String(data.kpis.notificationsNonLues)}
              tone="accent"
            />
            <KpiCard
              icon={CalendarClock}
              label={t("dashboard.kpi.echeance")}
              value={
                data.kpis.prochaineEcheance
                  ? fmtDateShort(data.kpis.prochaineEcheance.date)
                  : t("dashboard.kpi.aucuneEcheance")
              }
              hint={
                data.kpis.prochaineEcheance
                  ? fmtMoney(
                      data.kpis.prochaineEcheance.montant,
                      data.kpis.prochaineEcheance.devise,
                    )
                  : undefined
              }
              tone="warm"
              wrapValue
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RecentRequests items={data.demandesRecentes} fmtDate={fmtDate} isAr={isAr} />
            <RecentNotifications items={data.notificationsRecentes} fmtDate={fmtDate} isAr={isAr} />
          </div>

          <UpcomingDeadlines items={data.echeances} fmtDate={fmtDate} fmtMoney={fmtMoney} />
        </>
      )}
    </div>
  );
}

type Tone = "primary" | "success" | "accent" | "warm";

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  wrapValue,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  tone: Tone;
  wrapValue?: boolean;
}) {
  const bg: Record<Tone, string> = {
    primary: "color-mix(in oklab, var(--primary) 12%, transparent)",
    success: "color-mix(in oklab, var(--primary) 18%, transparent)",
    accent: "color-mix(in oklab, var(--accent) 25%, transparent)",
    warm: "color-mix(in oklab, var(--accent) 15%, transparent)",
  };
  const fg: Record<Tone, string> = {
    primary: "var(--primary)",
    success: "var(--primary)",
    accent: "var(--foreground)",
    warm: "var(--foreground)",
  };
  return (
    <div
      className="rounded-2xl bg-card p-5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div
            className={`mt-1 text-2xl font-bold tracking-tight text-foreground ${
              wrapValue ? "break-words" : "truncate"
            }`}
          >
            {value}
          </div>
          {hint && (
            <div className="mt-0.5 text-xs text-muted-foreground truncate" dir="ltr">
              {hint}
            </div>
          )}
        </div>
        <div
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: bg[tone], color: fg[tone] }}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </div>
  );
}

function StatutBadge({ statut }: { statut: DemandeStatut }) {
  const { t } = useTranslation();
  const s = STATUT_STYLES[statut];
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: s.bg, color: s.fg }}
    >
      {t(`dashboard.statut.${statut}`)}
    </span>
  );
}

function RecentRequests({
  items,
  fmtDate,
  isAr,
}: {
  items: DemandeRecente[];
  fmtDate: (s: string) => string;
  isAr: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Card style={{ boxShadow: "var(--shadow-soft)" }} className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-primary" aria-hidden />
          {t("dashboard.recent.title")}
        </CardTitle>
        <Link
          to="/espace/demandes"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {t("dashboard.recent.viewAll")}
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
        </Link>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("dashboard.recent.empty")}</p>
        ) : (
          <ul className="divide-y">
            {items.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {isAr && d.prestation_ar ? d.prestation_ar : d.prestation}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span dir="ltr">#{d.id}</span> · <span>{fmtDate(d.date)}</span>
                  </div>
                </div>
                <StatutBadge statut={d.statut} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function RecentNotifications({
  items,
  fmtDate,
  isAr,
}: {
  items: NotificationRecente[];
  fmtDate: (s: string) => string;
  isAr: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Card style={{ boxShadow: "var(--shadow-soft)" }} className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-primary" aria-hidden />
          {t("dashboard.notifications.title")}
        </CardTitle>
        <Link
          to="/espace/notifications"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {t("dashboard.notifications.viewAll")}
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
        </Link>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.notifications.empty")}
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((n) => {
              const titre = isAr && n.titre_ar ? n.titre_ar : n.titre;
              const texte = isAr && n.texte_ar ? n.texte_ar : n.texte;
              return (
                <li
                  key={n.id}
                  className={`rounded-xl border p-3 ${
                    n.lu
                      ? "border-border/60 bg-transparent"
                      : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium text-foreground flex items-center gap-2">
                      {!n.lu && (
                        <span
                          aria-hidden
                          className="inline-block h-2 w-2 rounded-full bg-primary"
                        />
                      )}
                      {titre}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {fmtDate(n.date)}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{texte}</p>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function UpcomingDeadlines({
  items,
  fmtDate,
  fmtMoney,
}: {
  items: Echeance[];
  fmtDate: (s: string) => string;
  fmtMoney: (v: number, d: string) => string;
}) {
  const { t } = useTranslation();
  return (
    <Card style={{ boxShadow: "var(--shadow-soft)" }} className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-4 w-4 text-primary" aria-hidden />
          {t("dashboard.echeances.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("dashboard.echeances.empty")}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {e.libelle}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {fmtDate(e.date)}
                  </div>
                </div>
                <div
                  className="text-sm font-semibold text-foreground whitespace-nowrap"
                  dir="ltr"
                >
                  {fmtMoney(e.montant, e.devise)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
