import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/shells/PublicShell";
import { Smartphone, Eye, ShieldCheck, Ticket, Plane, Car, Info } from "lucide-react";

export const Route = createFileRoute("/conventions")({
  component: ConventionsPage,
});

const CATEGORIES = [
  { key: "telecom", icon: Smartphone },
  { key: "optique", icon: Eye },
  { key: "assurance", icon: ShieldCheck },
  { key: "loisirs", icon: Ticket },
  { key: "voyages", icon: Plane },
  { key: "auto", icon: Car },
] as const;

function ConventionsPage() {
  const { t } = useTranslation();
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {t("conventions.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("conventions.intro")}</p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
          <Info className="h-3.5 w-3.5" aria-hidden />
          {t("conventions.publicNotice")}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div
              key={c.key}
              className="rounded-2xl bg-card p-6"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-primary"
                style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}
              >
                <c.icon className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                {t(`conventions.cat.${c.key}.title`)}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(`conventions.cat.${c.key}.partner`)}
              </p>
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                  {t("conventions.advantage")}
                </div>
                <p className="mt-1 text-sm text-foreground/90">
                  {t(`conventions.cat.${c.key}.avantage`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
