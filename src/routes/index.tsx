import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/shells/PublicShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <PublicShell>
      <section className="bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <p className="text-sm font-medium text-primary">{t("app.name")}</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
            {t("home.heroLead")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={user ? "/espace/dashboard" : "/login"}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("home.ctaMember")}
            </Link>
            <Link
              to="/missions"
              className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-secondary"
            >
              {t("home.ctaLearn")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-muted-foreground">{t("app.tagline")}</p>
      </section>
    </PublicShell>
  );
}
