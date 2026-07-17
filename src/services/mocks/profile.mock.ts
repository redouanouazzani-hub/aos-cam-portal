import type { ProfileResponse, ContactPayload, ConjointPayload } from "../types";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

let store: ProfileResponse = {
  official: {
    adherent: {
      matricule: "123456",
      nom: "Alaoui",
      prenom: "Karim",
      cin: "AB123456",
      date_naissance: "1985-03-12",
      grade: "Cadre",
      direction: "DSI",
    },
    enfants: [
      { id: 1, nom: "Alaoui", prenom: "Sara", date_naissance: "2015-06-01", sexe: "F" },
      { id: 2, nom: "Alaoui", prenom: "Adam", date_naissance: "2018-11-20", sexe: "M" },
    ],
  },
  declarative: {
    contact: {
      telephone: "0612345678",
      email: "karim@example.com",
      adresse: "12 rue X, Rabat",
    },
    conjoint: {
      nom: "Bennani",
      prenom: "Salma",
      cin: "CD654321",
      statut: "en_attente_validation",
    },
  },
};

export async function mockGetProfile(): Promise<ProfileResponse> {
  await delay();
  return JSON.parse(JSON.stringify(store));
}

export async function mockUpdateContact(p: ContactPayload): Promise<ProfileResponse["declarative"]["contact"]> {
  await delay();
  if (p.email?.includes("error")) {
    throw new Error("Erreur réseau simulée");
  }
  store.declarative.contact = { ...p };
  return { ...store.declarative.contact };
}

export async function mockCreateConjoint(p: ConjointPayload) {
  await delay();
  store.declarative.conjoint = { ...p, statut: "en_attente_validation" };
  return { ...store.declarative.conjoint };
}

let claimSeq = 1000;
export async function mockCreateDataClaim(_message: string, _file: File) {
  await delay(500);
  return { id: ++claimSeq, statut: "soumis" as const };
}
