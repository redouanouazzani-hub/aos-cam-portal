import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/admin/dossiers")({
  component: () => <PlaceholderPage titleKey="nav.adminFiles" />,
});
