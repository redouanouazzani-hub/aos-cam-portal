import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/admin/dashboard")({
  component: () => <PlaceholderPage titleKey="nav.dashboard" />,
});
