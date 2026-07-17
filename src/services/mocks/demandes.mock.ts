import type {
  DemandeDetail,
  DemandeListItem,
  DemandesFilters,
  DemandeStatut,
} from "../types";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const list: DemandeListItem[] = [
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
  {
    id: 4688,
    prestation: "Aide au logement",
    prestation_ar: "المساعدة على السكن",
    date: "2026-05-22",
    statut: "refuse",
  },
  {
    id: 4655,
    prestation: "Voyage organisé — Turquie",
    prestation_ar: "رحلة منظمة — تركيا",
    date: "2026-05-05",
    statut: "cloture",
  },
  {
    id: 4640,
    prestation: "Aide médicale exceptionnelle",
    prestation_ar: "مساعدة طبية استثنائية",
    date: "2026-04-18",
    statut: "archive",
  },
  {
    id: 4901,
    prestation: "Demande de crédit véhicule",
    prestation_ar: "طلب قرض سيارة",
    date: "2026-07-15",
    statut: "brouillon",
  },
];

const details: Record<number, DemandeDetail> = {
  4821: {
    id: 4821,
    prestation: "Colonie de vacances — été 2026",
    prestation_ar: "المخيم الصيفي — صيف 2026",
    description:
      "Inscription de deux enfants à la colonie de vacances organisée par l'AOS-CMR.",
    description_ar:
      "تسجيل ابنين في المخيم الصيفي الذي تنظمه جمعية الأعمال الاجتماعية.",
    date: "2026-07-10",
    statut: "en_cours_instruction",
    timeline: [
      { statut: "soumis", date: "2026-07-10" },
      { statut: "en_cours_instruction", date: "2026-07-11", current: true },
      { statut: "valide", date: null },
      { statut: "cloture", date: null },
    ],
    piecesJointes: [
      { id: 1, nom: "certificat-scolarite.pdf", nom_ar: "شهادة مدرسية.pdf", date: "2026-07-10", filigraneServeur: true },
      { id: 2, nom: "copie-cin.pdf", nom_ar: "نسخة من ب.ت.و.pdf", date: "2026-07-10", filigraneServeur: true },
    ],
    historique: [
      { id: 1, date: "2026-07-10", action: "Demande soumise", action_ar: "تم إرسال الطلب", auteur: "Adhérent" },
      { id: 2, date: "2026-07-11", action: "Prise en charge par un gestionnaire", action_ar: "تم تولّي المعالجة من طرف مدبّر", auteur: "Gestion" },
    ],
  },
  4802: {
    id: 4802,
    prestation: "Aide à la scolarité",
    prestation_ar: "المساعدة على التمدرس",
    description: "Aide annuelle pour la rentrée scolaire.",
    description_ar: "مساعدة سنوية بمناسبة الدخول المدرسي.",
    date: "2026-07-02",
    statut: "complement_demande",
    timeline: [
      { statut: "soumis", date: "2026-07-02" },
      { statut: "en_cours_instruction", date: "2026-07-04" },
      { statut: "complement_demande", date: "2026-07-12", current: true },
      { statut: "valide", date: null },
      { statut: "cloture", date: null },
    ],
    piecesJointes: [
      { id: 1, nom: "attestation-inscription.pdf", nom_ar: "شهادة التسجيل.pdf", date: "2026-07-02", filigraneServeur: true },
    ],
    historique: [
      { id: 1, date: "2026-07-02", action: "Demande soumise", action_ar: "تم إرسال الطلب", auteur: "Adhérent" },
      { id: 2, date: "2026-07-04", action: "Instruction démarrée", action_ar: "بدء المعالجة", auteur: "Gestion" },
      { id: 3, date: "2026-07-12", action: "Complément demandé : certificat de scolarité manquant", action_ar: "طلب استكمال: شهادة مدرسية ناقصة", auteur: "Gestion" },
    ],
  },
  4750: {
    id: 4750,
    prestation: "Prêt d'honneur",
    prestation_ar: "قرض شرفي",
    date: "2026-06-18",
    statut: "valide",
    timeline: [
      { statut: "soumis", date: "2026-06-18" },
      { statut: "en_cours_instruction", date: "2026-06-20" },
      { statut: "valide", date: "2026-07-05", current: true },
    ],
    piecesJointes: [
      { id: 1, nom: "engagement.pdf", nom_ar: "التزام.pdf", date: "2026-06-18", filigraneServeur: true },
    ],
    historique: [
      { id: 1, date: "2026-06-18", action: "Demande soumise", action_ar: "تم إرسال الطلب", auteur: "Adhérent" },
      { id: 2, date: "2026-07-05", action: "Demande validée", action_ar: "تمت المصادقة على الطلب", auteur: "Gestion" },
    ],
  },
  4711: {
    id: 4711,
    prestation: "Convention optique",
    prestation_ar: "اتفاقية النظارات",
    date: "2026-06-04",
    statut: "soumis",
    timeline: [
      { statut: "soumis", date: "2026-06-04", current: true },
      { statut: "en_cours_instruction", date: null },
      { statut: "valide", date: null },
    ],
    piecesJointes: [],
    historique: [
      { id: 1, date: "2026-06-04", action: "Demande soumise", action_ar: "تم إرسال الطلب", auteur: "Adhérent" },
    ],
  },
  4688: {
    id: 4688,
    prestation: "Aide au logement",
    prestation_ar: "المساعدة على السكن",
    date: "2026-05-22",
    statut: "refuse",
    timeline: [
      { statut: "soumis", date: "2026-05-22" },
      { statut: "en_cours_instruction", date: "2026-05-24" },
      { statut: "refuse", date: "2026-06-02", current: true },
    ],
    piecesJointes: [
      { id: 1, nom: "contrat-bail.pdf", nom_ar: "عقد الكراء.pdf", date: "2026-05-22", filigraneServeur: true },
    ],
    historique: [
      { id: 1, date: "2026-05-22", action: "Demande soumise", action_ar: "تم إرسال الطلب", auteur: "Adhérent" },
      { id: 2, date: "2026-06-02", action: "Demande refusée : plafond dépassé", action_ar: "تم رفض الطلب: تم تجاوز السقف", auteur: "Gestion" },
    ],
  },
  4655: {
    id: 4655,
    prestation: "Voyage organisé — Turquie",
    prestation_ar: "رحلة منظمة — تركيا",
    date: "2026-05-05",
    statut: "cloture",
    timeline: [
      { statut: "soumis", date: "2026-05-05" },
      { statut: "en_cours_instruction", date: "2026-05-06" },
      { statut: "valide", date: "2026-05-12" },
      { statut: "cloture", date: "2026-06-01", current: true },
    ],
    piecesJointes: [
      { id: 1, nom: "reservation.pdf", nom_ar: "الحجز.pdf", date: "2026-05-05", filigraneServeur: true },
    ],
    historique: [
      { id: 1, date: "2026-05-05", action: "Demande soumise", action_ar: "تم إرسال الطلب", auteur: "Adhérent" },
      { id: 2, date: "2026-05-12", action: "Demande validée", action_ar: "تمت المصادقة على الطلب", auteur: "Gestion" },
      { id: 3, date: "2026-06-01", action: "Dossier clôturé", action_ar: "تم إغلاق الملف", auteur: "Gestion" },
    ],
  },
  4640: {
    id: 4640,
    prestation: "Aide médicale exceptionnelle",
    prestation_ar: "مساعدة طبية استثنائية",
    date: "2026-04-18",
    statut: "archive",
    timeline: [
      { statut: "soumis", date: "2026-04-18" },
      { statut: "valide", date: "2026-04-30" },
      { statut: "cloture", date: "2026-05-10" },
      { statut: "archive", date: "2026-06-15", current: true },
    ],
    piecesJointes: [],
    historique: [
      { id: 1, date: "2026-06-15", action: "Dossier archivé", action_ar: "تمت أرشفة الملف", auteur: "Système" },
    ],
  },
  4901: {
    id: 4901,
    prestation: "Demande de crédit véhicule",
    prestation_ar: "طلب قرض سيارة",
    date: "2026-07-15",
    statut: "brouillon",
    timeline: [
      { statut: "brouillon", date: "2026-07-15", current: true },
      { statut: "soumis", date: null },
      { statut: "en_cours_instruction", date: null },
      { statut: "valide", date: null },
    ],
    piecesJointes: [],
    historique: [
      { id: 1, date: "2026-07-15", action: "Brouillon créé", action_ar: "تم إنشاء المسودة", auteur: "Adhérent" },
    ],
  },
};

export async function mockGetDemandes(filters: DemandesFilters = {}): Promise<DemandeListItem[]> {
  await delay();
  let items = list.map((d) => ({ ...d }));
  const statut = filters.statut;
  if (statut && statut !== "tous") {
    items = items.filter((d) => d.statut === statut);
  }
  if (filters.q && filters.q.trim()) {
    const q = filters.q.trim().toLowerCase();
    items = items.filter(
      (d) =>
        String(d.id).includes(q) ||
        d.prestation.toLowerCase().includes(q) ||
        (d.prestation_ar ?? "").toLowerCase().includes(q),
    );
  }
  const sort: "recent" | "ancien" = filters.sort ?? "recent";
  items.sort((a, b) =>
    sort === "recent"
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date),
  );
  return items;
}

export async function mockGetDemandeById(id: number): Promise<DemandeDetail | null> {
  await delay();
  const d = details[id];
  return d ? JSON.parse(JSON.stringify(d)) : null;
}

export const ALL_STATUTS: DemandeStatut[] = [
  "brouillon",
  "soumis",
  "en_cours_instruction",
  "complement_demande",
  "valide",
  "refuse",
  "cloture",
  "archive",
];
