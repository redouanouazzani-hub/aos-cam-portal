import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/espace/notifications")({
  component: () => <PlaceholderPage titleKey="nav.notifications" />,
});
