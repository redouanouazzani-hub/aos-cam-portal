import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/RequireRole";
import { AppShell } from "@/components/shells/AppShell";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/espace")({
  component: EspaceLayout,
});

function EspaceLayout() {
  const { t } = useTranslation();
  const items = [
    { to: "/espace/dashboard", key: "nav.dashboard" },
    { to: "/espace/profil", key: "nav.profile" },
    { to: "/espace/ayants-droit", key: "nav.beneficiaries" },
    { to: "/espace/demandes", key: "nav.requests" },
    { to: "/espace/notifications", key: "nav.notifications" },
    { to: "/espace/documents", key: "nav.documents" },
  ];
  return (
    <RequireRole roles={["adherent"]}>
      <AppShell title={t("nav.login")} items={items}>
        <Outlet />
      </AppShell>
    </RequireRole>
  );
}
