import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/espace/demandes")({
  component: () => <PlaceholderPage titleKey="nav.requests" />,
});
