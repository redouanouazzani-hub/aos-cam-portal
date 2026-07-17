import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/admin/reporting")({
  component: () => <PlaceholderPage titleKey="nav.adminReports" />,
});
