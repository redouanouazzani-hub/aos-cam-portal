/**
 * Campagne à délai — mock partagé (§4.4).
 *
 * Deux campagnes de démo : ESTIVAGE et SCOLARITÉ. Seules les DATES sont
 * stockées (`dateOuverture`, `dateLimite`) — le STATUT est calculé à la
 * volée par `campagne.service.ts` en comparant `now` à ces deux bornes.
 * Rien n'est figé côté mock : changer `now` change le statut.
 */
import type { ModuleActivite } from "../types";

interface CampagneRow {
  activite: ModuleActivite;
  dateOuverture: string; // ISO local
  dateLimite: string; // ISO local
}

// État mutable côté mock — le super-admin peut modifier `dateLimite`.
const STORE: Record<string, CampagneRow> = {
  estivage: {
    activite: "estivage",
    dateOuverture: "2026-06-01T00:00:00",
    dateLimite: "2026-08-31T23:59:59",
  },
  scolarite: {
    activite: "scolarite",
    dateOuverture: "2026-07-01T00:00:00",
    dateLimite: "2026-09-15T23:59:59",
  },
};

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function mockGetCampagneRow(
  activite: ModuleActivite,
): Promise<CampagneRow | null> {
  await delay();
  return STORE[activite] ? { ...STORE[activite] } : null;
}

export async function mockSetDateLimite(
  activite: ModuleActivite,
  dateLimite: string,
): Promise<CampagneRow> {
  await delay(300);
  const row = STORE[activite];
  if (!row) throw new Error("Campagne introuvable");
  row.dateLimite = dateLimite;
  return { ...row };
}
