import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/espace/")({
  component: () => <Navigate to="/espace/dashboard" />,
});
