import {
  createFileRoute,
  Link,
  Outlet,
  useMatch,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, FileText, Search } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { STATUT_ORDER, STATUT_STYLES } from "@/lib/statut-styles";

export const Route = createFileRoute("/espace/demandes")({
  component: DemandesLayout,
});

function DemandesLayout() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const navigate = useNavigate();
  const detailMatch = useMatch({
    from: "/espace/demandes/$id",
    shouldThrow: false,
  });
  const selectedId = detailMatch?.params.id ?? null;

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

  const listPanel = (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("demandes.title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("demandes.subtitle")}</p>
      </header>

      <Card style={{ boxShadow: "var(--shadow-soft)" }} className="rounded-2xl">
        <CardContent className="flex flex-col gap-3 p-4 lg:gap-4">
          <div>
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {t("demandes.filters.statut")}
              </label>
              <Select
                value={filters.statut ?? "tous"}
                onValueChange={(v) =>
                  setFilters((f) => ({
                    ...f,
                    statut: v as DemandeStatut | "tous",
                  }))
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
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {t("demandes.filters.sort")}
              </label>
              <Select
                value={filters.sort ?? "recent"}
                onValueChange={(v) =>
                  setFilters((f) => ({ ...f, sort: v as DemandeSort }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    {t("demandes.filters.recent")}
                  </SelectItem>
                  <SelectItem value="ancien">
                    {t("demandes.filters.ancien")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {items === null ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            {t("demandes.empty")}
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((d) => {
            const label =
              isAr && d.prestation_ar ? d.prestation_ar : d.prestation;
            const isActive = selectedId === String(d.id);
            return (
              <li key={d.id}>
                <Link
                  to="/espace/demandes/$id"
                  params={{ id: String(d.id) }}
                  className={`block rounded-2xl bg-card p-4 transition hover:bg-secondary/40 ${
                    isActive
                      ? "ring-2 ring-primary/60"
                      : "ring-1 ring-transparent"
                  }`}
                  style={{ boxShadow: "var(--shadow-soft)" }}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground" dir="ltr">
                        #{d.id}
                      </div>
                      <div className="mt-0.5 truncate text-sm font-medium text-foreground">
                        {label}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {fmtDate(d.date)}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <StatutBadge statut={d.statut} />
                      <ArrowRight
                        className="h-3.5 w-3.5 text-muted-foreground rtl:rotate-180"
                        aria-hidden
                      />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <div className="min-w-0">{listPanel}</div>

      {/* Desktop side-by-side pane */}
      <aside className="hidden min-w-0 lg:block">
        {selectedId ? (
          <div
            className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl bg-background/40 p-1"
          >
            <Outlet />
          </div>
        ) : (
          <div
            className="sticky top-6 flex min-h-[24rem] items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/40 p-8 text-center"
          >
            <div className="max-w-xs space-y-2">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-5 w-5" aria-hidden />
              </div>
              <p className="text-sm font-medium text-foreground">
                {t("demandes.detail.selectPrompt")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("demandes.detail.selectHint")}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile / tablet drawer */}
      <Sheet
        open={!!selectedId}
        onOpenChange={(open) => {
          if (!open) navigate({ to: "/espace/demandes" });
        }}
      >
        <SheetContent
          side={isAr ? "left" : "right"}
          className="w-full overflow-y-auto p-4 sm:max-w-lg lg:hidden"
        >
          <VisuallyHidden.Root>
            <SheetTitle>{t("demandes.detail.title")}</SheetTitle>
          </VisuallyHidden.Root>
          {selectedId && <Outlet />}
        </SheetContent>
      </Sheet>
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
