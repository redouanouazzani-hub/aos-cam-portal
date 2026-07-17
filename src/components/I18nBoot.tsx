import { useEffect, useState, type ReactNode } from "react";
import i18n, { applyDirection } from "@/i18n";

/** Ensures i18n is initialised client-side and sets <html dir/lang> before render. */
export function I18nBoot({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lang = i18n.resolvedLanguage ?? i18n.language ?? "fr";
    applyDirection(lang);
    const onChange = (lng: string) => applyDirection(lng);
    i18n.on("languageChanged", onChange);
    setReady(true);
    return () => {
      i18n.off("languageChanged", onChange);
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
