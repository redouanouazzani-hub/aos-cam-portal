import { useTranslation } from "react-i18next";

export function PlaceholderPage({
  titleKey,
  title,
}: {
  titleKey?: string;
  title?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        {titleKey ? t(titleKey) : title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">{t("common.comingSoon")}</p>
    </div>
  );
}
