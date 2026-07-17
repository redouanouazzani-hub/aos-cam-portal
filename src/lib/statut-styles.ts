import type { DemandeStatut } from "@/services/types";

export const STATUT_STYLES: Record<DemandeStatut, { bg: string; fg: string }> = {
  brouillon: { bg: "oklch(0.92 0.02 260)", fg: "oklch(0.35 0.03 260)" },
  soumis: { bg: "oklch(0.90 0.06 240)", fg: "oklch(0.32 0.10 240)" },
  en_cours_instruction: { bg: "oklch(0.90 0.09 75)", fg: "oklch(0.35 0.12 60)" },
  complement_demande: { bg: "oklch(0.90 0.10 45)", fg: "oklch(0.38 0.13 40)" },
  valide: { bg: "oklch(0.90 0.10 150)", fg: "oklch(0.32 0.12 150)" },
  refuse: { bg: "oklch(0.90 0.08 25)", fg: "oklch(0.40 0.15 25)" },
  cloture: { bg: "oklch(0.90 0.01 260)", fg: "oklch(0.35 0.02 260)" },
  archive: { bg: "oklch(0.88 0.01 260)", fg: "oklch(0.40 0.02 260)" },
};

export const STATUT_ORDER: DemandeStatut[] = [
  "brouillon",
  "soumis",
  "en_cours_instruction",
  "complement_demande",
  "valide",
  "refuse",
  "cloture",
  "archive",
];
