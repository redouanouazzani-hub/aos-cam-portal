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
  let years = at.getFullYear() - dob.getFullYear();
  let months = at.getMonth() - dob.getMonth();
  const days = at.getDate() - dob.getDate();
  if (days < 0) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return years + months / 12;
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
    let eligible = true;
    let raison: ScolariteEnfantEligible["raison"];
    if (age < 5.5) {
      eligible = false;
      raison = "trop_jeune";
    } else if (age > 26) {
      eligible = false;
      raison = "trop_age";
    }
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
