import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/espace/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold">{t("nav.dashboard")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {user ? user.fullName : ""}
      </p>
      <p className="mt-6 text-sm text-muted-foreground">{t("common.comingSoon")}</p>
    </div>
  );
}
