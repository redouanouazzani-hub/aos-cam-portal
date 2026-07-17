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
      prestation_ar: "المخيم الصيفي — صيف 2026",
      date: "2026-07-10",
      statut: "en_cours_instruction",
    },
    {
      id: 4802,
      prestation: "Aide à la scolarité",
      prestation_ar: "المساعدة على التمدرس",
      date: "2026-07-02",
      statut: "complement_demande",
    },
    {
      id: 4750,
      prestation: "Prêt d'honneur",
      prestation_ar: "قرض شرفي",
      date: "2026-06-18",
      statut: "valide",
    },
    {
      id: 4711,
      prestation: "Convention optique",
      prestation_ar: "اتفاقية النظارات",
      date: "2026-06-04",
      statut: "soumis",
    },
  ],
  notificationsRecentes: [
    {
      id: 91,
      titre: "Complément demandé",
      titre_ar: "طلب استكمال",
      texte: "Merci de joindre le certificat de scolarité pour la demande n°4802.",
      texte_ar: "يُرجى إرفاق الشهادة المدرسية للطلب رقم 4802.",
      date: "2026-07-14",
      lu: false,
    },
    {
      id: 90,
      titre: "Nouvelle convention partenaire",
      titre_ar: "اتفاقية شريكة جديدة",
      texte: "Nouvelle offre optique disponible avec 25% de remise.",
      texte_ar: "عرض جديد للنظارات مع تخفيض بنسبة 25%.",
      date: "2026-07-11",
      lu: false,
    },
    {
      id: 89,
      titre: "Demande validée",
      titre_ar: "تمت المصادقة على الطلب",
      texte: "Votre prêt d'honneur n°4750 a été validé.",
      texte_ar: "تمت المصادقة على قرضكم الشرفي رقم 4750.",
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
