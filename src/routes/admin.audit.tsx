import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AccessDenied } from "@/components/AccessDenied";

export const Route = createFileRoute("/admin/audit")({
  component: AuditPage,
});

const LOGS = [
  { id: 1, ts: "2026-07-17T09:14:00Z", user: "Salma Idrissi", action: "instruction.demande", ref: "DEM-1042" },
  { id: 2, ts: "2026-07-17T08:47:00Z", user: "Youssef Benali", action: "rbac.assigner_modules", ref: "u-13" },
  { id: 3, ts: "2026-07-16T17:22:00Z", user: "Salma Idrissi", action: "validation.credit", ref: "DEM-1039" },
  { id: 4, ts: "2026-07-16T14:05:00Z", user: "Youssef Benali", action: "passation.creee", ref: "PASS-88" },
  { id: 5, ts: "2026-07-16T10:31:00Z", user: "Rachid El Amrani", action: "consultation.dossier", ref: "DEM-1035" },
];

function AuditPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  if (user?.role !== "super-admin") {
    return <AccessDenied reason={t("admin.access.superAdminOnly")} />;
  }

  const locale = i18n.language.startsWith("ar") ? "ar-MA" : "fr-FR";
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(locale, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("admin.audit.title")}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">{t("admin.audit.subtitle")}</p>

      <div
        className="rounded-2xl bg-card border border-border overflow-hidden"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr className="text-xs text-muted-foreground">
              <th className="text-start font-medium py-2 px-3">{t("admin.audit.col.date")}</th>
              <th className="text-start font-medium py-2 px-3">{t("admin.audit.col.user")}</th>
              <th className="text-start font-medium py-2 px-3">{t("admin.audit.col.action")}</th>
              <th className="text-start font-medium py-2 px-3">{t("admin.audit.col.ref")}</th>
            </tr>
          </thead>
          <tbody>
            {LOGS.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="py-2 px-3 text-foreground whitespace-nowrap" dir="ltr">
                  {fmt(l.ts)}
                </td>
                <td className="py-2 px-3 text-foreground">{l.user}</td>
                <td className="py-2 px-3">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-[11px]" dir="ltr">
                    {l.action}
                  </code>
                </td>
                <td className="py-2 px-3 text-muted-foreground" dir="ltr">
                  {l.ref}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
