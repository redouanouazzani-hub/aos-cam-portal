import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/espace/ayants-droit")({
  component: () => <PlaceholderPage titleKey="nav.beneficiaries" />,
});
