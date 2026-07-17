import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Search } from "lucide-react";
import { demandesService } from "@/services/demandes.service";
import type {
  DemandeListItem,
  DemandeSort,
  DemandeStatut,
  DemandesFilters,
} from "@/services/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUT_ORDER, STATUT_STYLES } from "@/lib/statut-styles";

export const Route = createFileRoute("/espace/demandes")({
  component: DemandesListPage,
});

function DemandesListPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const [items, setItems] = useState<DemandeListItem[] | null>(null);
  const [filters, setFilters] = useState<DemandesFilters>({
    statut: "tous",
    sort: "recent",
    q: "",
  });

  useEffect(() => {
    let alive = true;
    setItems(null);
    demandesService.getDemandes(filters).then((r) => {
      if (alive) setItems(r);
    });
    return () => {
      alive = false;
    };
  }, [filters.statut, filters.sort, filters.q]);

  const dateLocale = isAr ? "ar-MA" : "fr-FR";
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statutOptions = useMemo(
    () => [
      { value: "tous" as const, label: t("demandes.filters.statutTous") },
      ...STATUT_ORDER.map((s) => ({
        value: s,
        label: t(`dashboard.statut.${s}`),
      })),
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("demandes.title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("demandes.subtitle")}</p>
      </header>

      <Card style={{ boxShadow: "var(--shadow-soft)" }} className="rounded-2xl">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-end md:gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              {t("demandes.filters.search")}
            </label>
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground start-3"
              />
              <Input
                value={filters.q ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                placeholder={t("demandes.filters.searchPlaceholder")}
                className="ps-9"
              />
            </div>
          </div>
          <div className="w-full md:w-56">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              {t("demandes.filters.statut")}
            </label>
            <Select
              value={filters.statut ?? "tous"}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, statut: v as DemandeStatut | "tous" }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statutOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              {t("demandes.filters.sort")}
            </label>
            <Select
              value={filters.sort ?? "recent"}
              onValueChange={(v) => setFilters((f) => ({ ...f, sort: v as DemandeSort }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">{t("demandes.filters.recent")}</SelectItem>
                <SelectItem value="ancien">{t("demandes.filters.ancien")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {items === null ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            {t("demandes.empty")}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl bg-card md:block" style={{ boxShadow: "var(--shadow-soft)" }}>
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">{t("demandes.col.numero")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("demandes.col.prestation")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("demandes.col.date")}</th>
                  <th className="px-4 py-3 text-start font-medium">{t("demandes.col.statut")}</th>
                  <th className="px-4 py-3 text-end font-medium sr-only">action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((d) => {
                  const label = isAr && d.prestation_ar ? d.prestation_ar : d.prestation;
                  return (
                    <tr key={d.id} className="hover:bg-secondary/40">
                      <td className="px-4 py-3 font-medium" dir="ltr">#{d.id}</td>
                      <td className="px-4 py-3">
                        <Link
                          to="/espace/demandes/$id"
                          params={{ id: String(d.id) }}
                          className="text-foreground hover:text-primary hover:underline"
                        >
                          {label}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{fmtDate(d.date)}</td>
                      <td className="px-4 py-3">
                        <StatutBadge statut={d.statut} />
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Link
                          to="/espace/demandes/$id"
                          params={{ id: String(d.id) }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          aria-label={t("demandes.detail.open")}
                        >
                          {t("demandes.detail.open")}
                          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {items.map((d) => {
              const label = isAr && d.prestation_ar ? d.prestation_ar : d.prestation;
              return (
                <li key={d.id}>
                  <Link
                    to="/espace/demandes/$id"
                    params={{ id: String(d.id) }}
                    className="block rounded-2xl bg-card p-4"
                    style={{ boxShadow: "var(--shadow-soft)" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground" dir="ltr">#{d.id}</div>
                        <div className="mt-0.5 text-sm font-medium text-foreground">{label}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{fmtDate(d.date)}</div>
                      </div>
                      <StatutBadge statut={d.statut} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
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
