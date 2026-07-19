import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/shells/PublicShell";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Users,
  FileText,
  Newspaper,
  Landmark,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const cards: Array<{
    icon: typeof HeartHandshake;
    title: string;
    desc: string;
    to: "/missions" | "/conventions" | "/actualites" | "/faq";
  }> = [
    {
      icon: HeartHandshake,
      title: t("nav.missions"),
      desc: t("home.card.missionsDesc"),
      to: "/missions",
    },
    {
      icon: Sparkles,
      title: t("nav.conventions"),
      desc: t("home.card.conventionsDesc"),
      to: "/conventions",
    },
    {
      icon: Newspaper,
      title: t("nav.news"),
      desc: t("home.card.newsDesc"),
      to: "/actualites",
    },
    {
      icon: FileText,
      title: t("nav.faq"),
      desc: t("home.card.faqDesc"),
      to: "/faq",
    },
  ];

  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b-4 border-accent">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div
          aria-hidden
          className="institutional-grid pointer-events-none absolute inset-y-0 end-0 w-1/2 opacity-30"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-[1.35fr_0.65fr] lg:px-6">
          <div className="max-w-3xl">
            <div className="mb-5 h-1 w-16 bg-accent" aria-hidden />
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-[3.4rem]">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {t("home.heroLead")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={user ? "/espace/dashboard" : "/login"}
                className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {t("home.ctaMember")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </Link>
              <Link
                to="/missions"
                className="rounded-md border border-white/50 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {t("home.ctaLearn")}
              </Link>
            </div>
          </div>
          <div className="hidden justify-self-end lg:block" aria-hidden>
            <div className="grid h-52 w-52 place-items-center border border-white/20 bg-white/[0.06]">
              <div className="grid h-36 w-36 place-items-center border border-accent/60">
                <Landmark className="h-16 w-16 text-white/90" strokeWidth={1.25} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("home.sectionTitle")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("home.sectionLead")}</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/35"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div
                aria-hidden
                className="absolute inset-y-0 start-0 w-1 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: "var(--primary)" }}
              />
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-primary/15 text-primary"
                style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}
              >
                <c.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
              <ArrowRight className="mt-5 h-4 w-4 text-primary/70 rtl:rotate-180" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-6">
        <div
          className="relative overflow-hidden rounded-lg border border-border p-8 md:p-12"
          style={{
            background: "var(--gradient-warm)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: t("home.trust.service.title"),
                desc: t("home.trust.service.desc"),
              },
              {
                icon: ShieldCheck,
                title: t("home.trust.security.title"),
                desc: t("home.trust.security.desc"),
              },
              {
                icon: HeartHandshake,
                title: t("home.trust.listening.title"),
                desc: t("home.trust.listening.desc"),
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-accent/25"
                  style={{
                    background: "color-mix(in oklab, var(--accent) 25%, transparent)",
                    color: "var(--foreground)",
                  }}
                >
                  <f.icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
