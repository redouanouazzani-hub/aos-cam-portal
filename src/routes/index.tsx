import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/shells/PublicShell";
import { useAuth } from "@/lib/auth-context";
import { HeartHandshake, Sparkles, ShieldCheck, Users, FileText, Newspaper } from "lucide-react";

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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        {/* organic blobs */}
        <div
          aria-hidden
          className="absolute -top-24 -end-24 h-96 w-96 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -start-16 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(0.85 0.12 150)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {t("app.name")}
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight text-white">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg text-white/90">
              {t("home.heroLead")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={user ? "/espace/dashboard" : "/login"}
                className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                {t("home.ctaMember")}
              </Link>
              <Link
                to="/missions"
                className="rounded-2xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition-colors"
              >
                {t("home.ctaLearn")}
              </Link>
            </div>
          </div>
        </div>

        {/* wave divider */}
        <svg
          aria-hidden
          viewBox="0 0 1440 80"
          className="relative block w-full text-background"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,48 C240,96 480,0 720,32 C960,64 1200,96 1440,48 L1440,80 L0,80 Z"
          />
        </svg>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("home.sectionTitle")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t("home.sectionLead")}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group relative overflow-hidden rounded-2xl bg-card p-6 transition-all hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div
                aria-hidden
                className="absolute -end-8 -top-8 h-24 w-24 rounded-full opacity-10 transition-opacity group-hover:opacity-20"
                style={{ background: "var(--primary)" }}
              />
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-primary"
                style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}
              >
                <c.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div
          className="relative overflow-hidden rounded-3xl p-8 md:p-12"
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
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
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
