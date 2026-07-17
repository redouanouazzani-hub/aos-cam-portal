import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/espace/documents")({
  component: () => <PlaceholderPage titleKey="nav.documents" />,
});
