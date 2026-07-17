import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Megaphone, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/admin/campagnes")({
  component: CampagnesPage,
});

const CAMPAGNES = [
  { id: 1, titre: "Estivage 2026", periode: "01/06/2026 → 31/08/2026", statut: "ouverte" as const },
  { id: 2, titre: "Scolarité rentrée 2026", periode: "01/07/2026 → 15/09/2026", statut: "planifiee" as const },
  { id: 3, titre: "Crédit logement — session automne", periode: "01/09/2026 → 31/10/2026", statut: "planifiee" as const },
  { id: 4, titre: "Voyage Omra 2026", periode: "01/04/2026 → 30/04/2026", statut: "cloturee" as const },
];

const TONE: Record<(typeof CAMPAGNES)[number]["statut"], string> = {
  ouverte: "bg-emerald-100 text-emerald-700",
  planifiee: "bg-amber-100 text-amber-700",
  cloturee: "bg-muted text-muted-foreground",
};

function CampagnesPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("admin.campagnes.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.campagnes.subtitle")}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {CAMPAGNES.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl bg-card p-5 border border-border"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Megaphone className="h-4.5 w-4.5" aria-hidden />
              </div>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${TONE[c.statut]}`}
              >
                {t(`admin.campagnes.statut.${c.statut}`)}
              </span>
            </div>
            <div className="mt-3 text-sm font-semibold text-foreground">{c.titre}</div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground" dir="ltr">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {c.periode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
