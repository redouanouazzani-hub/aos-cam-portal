import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/admin/audit")({
  component: () => <PlaceholderPage titleKey="nav.adminAudit" />,
});
