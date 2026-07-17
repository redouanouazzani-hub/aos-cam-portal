import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/RequireRole";
import { AppShell } from "@/components/shells/AppShell";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { t } = useTranslation();
  const items = [
    { to: "/admin/dashboard", key: "nav.dashboard" },
    { to: "/admin/comptes", key: "nav.adminAccounts" },
    { to: "/admin/campagnes", key: "nav.adminCampaigns" },
    { to: "/admin/dossiers", key: "nav.adminFiles" },
    { to: "/admin/reporting", key: "nav.adminReports" },
    { to: "/admin/audit", key: "nav.adminAudit" },
  ];
  return (
    <RequireRole roles={["gestionnaire", "super-admin"]}>
      <AppShell title={t("nav.admin")} items={items}>
        <Outlet />
      </AppShell>
    </RequireRole>
  );
}
