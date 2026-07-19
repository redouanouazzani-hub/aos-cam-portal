import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/shells/PublicShell";
import { ArrowRight, Calendar } from "lucide-react";
import { NEWS } from "@/lib/news-data";

export const Route = createFileRoute("/actualites")({
  component: NewsListPage,
});

function NewsListPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const dateLocale = isAr ? "ar-MA" : "fr-FR";
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <PublicShell>
      <div className="public-page-header">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("news.title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("news.subtitle")}</p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {NEWS.map((n) => (
            <Link
              key={n.id}
              to="/actualites/$id"
              params={{ id: String(n.id) }}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/35"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div
                aria-hidden
                className="relative h-40 w-full overflow-hidden"
                style={{ background: n.bg }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.35), transparent 55%)",
                  }}
                />
              </div>
              <div className="flex-1 p-5">
                <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {fmtDate(n.date)}
                </div>
                <h2 className="mt-2 text-base font-semibold text-foreground line-clamp-2">
                  {isAr ? n.title_ar : n.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {isAr ? n.excerpt_ar : n.excerpt}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  {t("news.readMore")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
