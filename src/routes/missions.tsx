import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/shells/PublicShell";
import { HeartHandshake, GraduationCap, Home, Plane, Sparkles, Users2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/missions")({
  component: MissionsPage,
});

function MissionsPage() {
  const { t } = useTranslation();

  const missions = [
    { icon: Home, key: "logement" },
    { icon: HeartHandshake, key: "prestations" },
    { icon: GraduationCap, key: "education" },
    { icon: Plane, key: "loisirs" },
    { icon: Users2, key: "solidarite" },
    { icon: Sparkles, key: "culture" },
  ] as const;

  return (
    <PublicShell>
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {t("missions.title")}
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          {t("missions.intro")}
        </p>

        <h2 className="mt-12 text-xl md:text-2xl font-semibold text-foreground">
          {t("missions.axesTitle")}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {missions.map((m) => (
            <div
              key={m.key}
              className="rounded-2xl bg-card p-5"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-primary"
                style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}
              >
                <m.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-3 font-semibold text-foreground">
                {t(`missions.axes.${m.key}.title`)}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t(`missions.axes.${m.key}.desc`)}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-xl md:text-2xl font-semibold text-foreground">
          {t("missions.governanceTitle")}
        </h2>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          {t("missions.governance")}
        </p>

        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden />
            <p className="text-sm text-foreground leading-relaxed">
              {t("missions.eligibility")}
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
