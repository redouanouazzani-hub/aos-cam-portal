import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, Loader2, Lock, Megaphone, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { campagneService } from "@/services/campagne.service";
import { useAuth } from "@/lib/auth-context";
import type { Campagne, CampagneStatutAuto } from "@/services/types";

export const Route = createFileRoute("/admin/campagnes")({
  component: CampagnesPage,
});

const STATIC_CAMPAGNES = [
  {
    id: 3,
    activite: null,
    titre: "Crédit logement — session automne",
    periode: "01/09/2026 → 31/10/2026",
    statut: "planifiee" as const,
  },
  {
    id: 4,
    activite: null,
    titre: "Voyage Omra 2026",
    periode: "01/04/2026 → 30/04/2026",
    statut: "cloturee" as const,
  },
];

const STATIC_TONE: Record<"planifiee" | "cloturee", string> = {
  planifiee: "bg-amber-100 text-amber-700",
  cloturee: "bg-muted text-muted-foreground",
};

const AUTO_TONE: Record<CampagneStatutAuto, string> = {
  a_venir: "bg-amber-100 text-amber-700",
  ouverte: "bg-emerald-100 text-emerald-700",
  fermee: "bg-muted text-muted-foreground",
};

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function CampagnesPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super-admin";

  const [estivage, setEstivage] = useState<Campagne | null>(null);
  const [scolarite, setScolarite] = useState<Campagne | null>(null);
  const [dateLimiteEstivage, setDateLimiteEstivage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      campagneService.getCampagne("estivage"),
      campagneService.getCampagne("scolarite"),
    ]).then(([e, s]) => {
      setEstivage(e);
      setScolarite(s);
      if (e) setDateLimiteEstivage(toDatetimeLocal(e.dateLimite));
    });
  }, []);

  const fmtPeriode = useMemo(() => {
    const locale = isAr ? "ar-MA" : "fr-FR";
    return (iso: string) =>
      new Date(iso).toLocaleString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  }, [isAr]);

  async function handleSaveEstivage() {
    if (!isSuperAdmin || !estivage) return;
    setSaving(true);
    try {
      const iso = new Date(dateLimiteEstivage).toISOString();
      const updated = await campagneService.setDateLimite("estivage", iso);
      setEstivage(updated);
      toast.success(t("admin.campagnes.save.success"));
    } catch {
      toast.error(t("admin.campagnes.save.error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("admin.campagnes.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.campagnes.subtitle")}
        </p>
      </div>

      {/* Estivage — SA modifiable, gestionnaire lecture seule (§4.4).
          Côté Laravel, l'écriture sera protégée par une policy super-admin. */}
      {estivage && (
        <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Megaphone className="h-4.5 w-4.5" aria-hidden />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {t("admin.campagnes.estivage.title")}
                  </div>
                  <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    {t("admin.campagnes.ouvertureLabel", {
                      date: fmtPeriode(estivage.dateOuverture),
                    })}
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${AUTO_TONE[estivage.statut]}`}
              >
                {t(`admin.campagnes.statutAuto.${estivage.statut}`)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("admin.campagnes.limiteLabel")}
                </label>
                <Input
                  type="datetime-local"
                  value={dateLimiteEstivage}
                  onChange={(e) => setDateLimiteEstivage(e.target.value)}
                  disabled={!isSuperAdmin || saving}
                />
              </div>
              <div className="flex items-end">
                {isSuperAdmin ? (
                  <button
                    type="button"
                    onClick={handleSaveEstivage}
                    disabled={saving || !dateLimiteEstivage}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ boxShadow: "var(--shadow-soft)" }}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Save className="h-4 w-4" aria-hidden />
                    )}
                    {t("admin.campagnes.save.cta")}
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    {t("admin.campagnes.saOnly")}
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              {t("admin.campagnes.serverNote")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Scolarité — lecture seule (démo) */}
      {scolarite && (
        <Card className="rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
          <CardContent className="flex flex-wrap items-center gap-3 p-5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Megaphone className="h-4.5 w-4.5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground">
                {t("admin.campagnes.scolarite.title")}
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                {fmtPeriode(scolarite.dateOuverture)} →{" "}
                {fmtPeriode(scolarite.dateLimite)}
              </div>
            </div>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${AUTO_TONE[scolarite.statut]}`}
            >
              {t(`admin.campagnes.statutAuto.${scolarite.statut}`)}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Campagnes statiques restantes */}
      <div className="grid gap-3 sm:grid-cols-2">
        {STATIC_CAMPAGNES.map((c) => (
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
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${STATIC_TONE[c.statut]}`}
              >
                {t(`admin.campagnes.statut.${c.statut}`)}
              </span>
            </div>
            <div className="mt-3 text-sm font-semibold text-foreground">
              {c.titre}
            </div>
            <div
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground"
              dir="ltr"
            >
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {c.periode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
