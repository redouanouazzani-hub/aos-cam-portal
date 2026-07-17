import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/shells/PublicShell";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/actualites")({
  component: () => (
    <PublicShell>
      <PlaceholderPage titleKey="nav.news" />
    </PublicShell>
  ),
});
