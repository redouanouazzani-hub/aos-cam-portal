import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/espace/profil")({
  component: () => <PlaceholderPage titleKey="nav.profile" />,
});
