import type { DashboardSummary } from "../types";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const summary: DashboardSummary = {
  kpis: {
    demandesEnCours: 2,
    demandesValidees: 5,
    notificationsNonLues: 3,
    prochaineEcheance: {
      libelle: "Précompte crédit logement",
      date: "2026-08-05",
      montant: 1850,
      devise: "MAD",
    },
  },
  demandesRecentes: [
    {
      id: 4821,
      prestation: "Colonie de vacances — été 2026",
      date: "2026-07-10",
      statut: "en_cours_instruction",
    },
    {
      id: 4802,
      prestation: "Aide à la scolarité",
      date: "2026-07-02",
      statut: "complement_demande",
    },
    {
      id: 4750,
      prestation: "Prêt d'honneur",
      date: "2026-06-18",
      statut: "valide",
    },
    {
      id: 4711,
      prestation: "Convention optique",
      date: "2026-06-04",
      statut: "soumis",
    },
  ],
  notificationsRecentes: [
    {
      id: 91,
      titre: "Complément demandé",
      texte: "Merci de joindre le certificat de scolarité pour la demande n°4802.",
      date: "2026-07-14",
      lu: false,
    },
    {
      id: 90,
      titre: "Nouvelle convention partenaire",
      texte: "Nouvelle offre optique disponible avec 25% de remise.",
      date: "2026-07-11",
      lu: false,
    },
    {
      id: 89,
      titre: "Demande validée",
      texte: "Votre prêt d'honneur n°4750 a été validé.",
      date: "2026-07-05",
      lu: true,
    },
  ],
  echeances: [
    {
      id: 1,
      libelle: "Précompte crédit logement",
      date: "2026-08-05",
      montant: 1850,
      devise: "MAD",
    },
    {
      id: 2,
      libelle: "Précompte prêt scolarité",
      date: "2026-09-05",
      montant: 620,
      devise: "MAD",
    },
  ],
};

export async function mockGetDashboardSummary(): Promise<DashboardSummary> {
  await delay();
  return JSON.parse(JSON.stringify(summary));
}
