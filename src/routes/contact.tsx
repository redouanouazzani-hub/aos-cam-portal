import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/shells/PublicShell";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/contact")({
  component: () => (
    <PublicShell>
      <PlaceholderPage titleKey="nav.contact" />
    </PublicShell>
  ),
});
