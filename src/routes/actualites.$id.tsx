import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/shells/PublicShell";
import { NEWS } from "@/lib/news-data";
import { ArrowLeft, Calendar } from "lucide-react";

export const Route = createFileRoute("/actualites/$id")({
  loader: ({ params }) => {
    const item = NEWS.find((n) => String(n.id) === params.id);
    if (!item) throw notFound();
    return { item };
  },
  component: NewsDetailPage,
  notFoundComponent: () => (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">404</h1>
      </div>
    </PublicShell>
  ),
});

function NewsDetailPage() {
  const { item } = Route.useLoaderData();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isAr ? "ar-MA" : "fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <Link to="/actualites" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {t("news.backList")}
        </Link>
        <div
          aria-hidden
          className="mt-6 h-56 w-full overflow-hidden rounded-3xl"
          style={{ background: item.bg }}
        />
        <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {fmtDate(item.date)}
        </div>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {isAr ? item.title_ar : item.title}
        </h1>
        <div className="prose prose-neutral mt-6 max-w-none text-foreground">
          {(isAr ? item.body_ar : item.body).split("\n\n").map((p: string, i: number) => (
            <p key={i} className="leading-relaxed text-[15px] text-foreground/90 mb-4">
              {p}
            </p>
          ))}
        </div>
      </article>
    </PublicShell>
  );
}
