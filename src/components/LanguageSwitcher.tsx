import { useTranslation } from "react-i18next";
import { applyDirection } from "@/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language ?? "fr";

  const change = (lng: "fr" | "ar") => {
    void i18n.changeLanguage(lng);
    applyDirection(lng);
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1 text-sm">
      <Globe className="h-4 w-4 text-muted-foreground" aria-hidden />
      <span className="sr-only">{t("common.language")}</span>
      <button
        type="button"
        onClick={() => change("fr")}
        aria-pressed={current === "fr"}
        className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
          current === "fr"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => change("ar")}
        aria-pressed={current === "ar"}
        className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
          current === "ar"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        AR
      </button>
    </div>
  );
}
