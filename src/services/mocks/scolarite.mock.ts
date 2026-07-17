import type {
  ScolariteEligibiliteResponse,
  ScolariteEnfantEligible,
  ScolaritePayload,
  ScolariteResponse,
} from "../types";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

// Enfants officiels mockés (base RH) — reprend la Vue 360° + bornes d'âge.
const ENFANTS: Array<{
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string;
  sexe: "M" | "F";
}> = [
  { id: 1, nom: "Alaoui", prenom: "Sara", date_naissance: "2015-06-01", sexe: "F" },
  { id: 2, nom: "Alaoui", prenom: "Adam", date_naissance: "2018-11-20", sexe: "M" },
  { id: 3, nom: "Alaoui", prenom: "Yasmine", date_naissance: "2022-06-01", sexe: "F" },
  { id: 4, nom: "Alaoui", prenom: "Youssef", date_naissance: "1999-05-01", sexe: "M" },
];

// Statut de campagne mocké — sera piloté par les vraies fenêtres côté Laravel.
const CAMPAGNE_STATUT: "ouverte" | "fermee" = "ouverte";

function ageAt(dobIso: string, atIso: string): number {
  const dob = new Date(dobIso);
  const at = new Date(atIso);
  const ms = at.getTime() - dob.getTime();
  return ms / (365.25 * 24 * 3600 * 1000);
}

// Éligibilité par comparaison de dates (précision au jour) — évite les erreurs
// dues à la conversion en fraction d'années (ex. 26 ans + 1 jour tronqué à 26.0).
export function eligibiliteAt(
  dobIso: string,
  atIso: string,
): { eligible: boolean; raison?: "trop_jeune" | "trop_age" } {
  const dob = new Date(dobIso);
  const at = new Date(atIso);
  // Borne basse : 5 ans et 6 mois (inclus).
  const minDate = new Date(
    dob.getFullYear() + 5,
    dob.getMonth() + 6,
    dob.getDate(),
  );
  // Borne haute : 26 ans (inclus).
  const maxDate = new Date(
    dob.getFullYear() + 26,
    dob.getMonth(),
    dob.getDate(),
  );
  if (at.getTime() < minDate.getTime())
    return { eligible: false, raison: "trop_jeune" };
  if (at.getTime() > maxDate.getTime())
    return { eligible: false, raison: "trop_age" };
  return { eligible: true };
}

export function currentDateRentree(): string {
  const y = new Date().getFullYear();
  const m = String(9).padStart(2, "0");
  return `${y}-${m}-01`;
}

export async function mockGetEnfantsEligibles(
  dateRentree: string,
): Promise<ScolariteEligibiliteResponse> {
  await delay();
  const enfants: ScolariteEnfantEligible[] = ENFANTS.map((e) => {
    const age = ageAt(e.date_naissance, dateRentree);
    const { eligible, raison } = eligibiliteAt(e.date_naissance, dateRentree);
    return { ...e, ageAnnees: age, eligible, raison };
  });

  return {
    campagne: {
      statut: CAMPAGNE_STATUT,
      dateRentree,
    },
    enfants,
  };
}

let seq = 5000;
export async function mockSoumettreScolarite(
  payload: ScolaritePayload,
): Promise<ScolariteResponse> {
  await delay(600);
  const id = ++seq;
  return {
    id,
    statut: "soumis",
    reference: `SCO-${id}`,
  };
}

export { CAMPAGNE_STATUT };
