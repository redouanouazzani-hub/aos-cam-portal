import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AccessDenied({ reason }: { reason?: string }) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-lg py-12">
      <div
        className="rounded-3xl bg-card p-8 text-center"
        style={{ boxShadow: "var(--shadow-lift)" }}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-bold text-foreground">
          {t("admin.access.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {reason ?? t("admin.access.desc")}
        </p>
        <Link
          to="/admin/dashboard"
          className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
        >
          {t("admin.access.back")}
        </Link>
      </div>
    </div>
  );
}
