import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FileDown, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { AccessDenied } from "@/components/AccessDenied";

export const Route = createFileRoute("/admin/extraction")({
  component: ExtractionPage,
});

function ExtractionPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  if (user?.role !== "super-admin") {
    return <AccessDenied reason={t("admin.access.superAdminOnly")} />;
  }
  const now = new Date();
  const [mois, setMois] = useState<string>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [busy, setBusy] = useState(false);

  const onExport = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    setBusy(false);
    toast.success(t("admin.extraction.success", { mois, format: format.toUpperCase() }));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("admin.extraction.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.extraction.subtitle")}</p>
      </div>

      <div
        className="rounded-2xl bg-card p-5 border border-border space-y-4"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div>
          <label className="block text-xs font-medium">{t("admin.extraction.mois")}</label>
          <div className="mt-1.5 relative">
            <Calendar
              className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden
            />
            <input
              type="month"
              value={mois}
              onChange={(e) => setMois(e.target.value)}
              dir="ltr"
              className="block w-full rounded-xl border border-input bg-background ps-9 pe-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium">{t("admin.extraction.format")}</label>
          <div className="mt-1.5 flex gap-2">
            {(["csv", "xlsx"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                  format === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-secondary"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onExport}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
        >
          <FileDown className="h-4 w-4" aria-hidden />
          {busy ? t("admin.extraction.generating") : t("admin.extraction.cta")}
        </button>
        <p className="text-xs text-muted-foreground">{t("admin.extraction.hint")}</p>
      </div>
    </div>
  );
}
