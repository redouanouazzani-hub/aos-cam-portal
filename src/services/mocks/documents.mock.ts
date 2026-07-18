import type { DocumentGenere, DocumentFilters } from "../types";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const MATRICULE = "123456";

const DOCS: DocumentGenere[] = [
  {
    id: 1,
    nom: "Reçu de pré-réservation — Estivage Agadir 2026",
    nom_ar: "وصل الحجز المبدئي — الاصطياف أكادير 2026",
    type: "recu_pre_reservation",
    date: "2026-06-14",
    dossierRef: "EST-2026-000482",
    filigraneDate: "2026-06-14",
    matricule: MATRICULE,
  },
  {
    id: 2,
    nom: "Autorisation de précompte — Crédit CMR",
    nom_ar: "إذن الاقتطاع — قرض CMR",
    type: "autorisation_precompte",
    date: "2026-05-03",
    dossierRef: "CRED-2026-000117",
    filigraneDate: "2026-05-03",
    matricule: MATRICULE,
  },
  {
    id: 3,
    nom: "Attestation d'adhésion AOS-CMR",
    nom_ar: "شهادة الانخراط AOS-CMR",
    type: "attestation",
    date: "2026-01-08",
    dossierRef: "—",
    filigraneDate: "2026-01-08",
    matricule: MATRICULE,
  },
  {
    id: 4,
    nom: "Notification de validation — Prime de naissance",
    nom_ar: "إشعار المصادقة — منحة الازدياد",
    type: "notification_validation",
    date: "2025-11-22",
    dossierRef: "PRIME-2025-000914",
    filigraneDate: "2025-11-22",
    matricule: MATRICULE,
  },
  {
    id: 5,
    nom: "Notification de validation — Subvention de scolarité",
    nom_ar: "إشعار المصادقة — منحة الدراسة",
    type: "notification_validation",
    date: "2025-10-05",
    dossierRef: "SCO-2025-002011",
    filigraneDate: "2025-10-05",
    matricule: MATRICULE,
  },
  {
    id: 6,
    nom: "Attestation de participation — Voyage organisé",
    nom_ar: "شهادة المشاركة — الرحلة المنظمة",
    type: "attestation",
    date: "2025-07-19",
    dossierRef: "VOY-2025-000308",
    filigraneDate: "2025-07-19",
    matricule: MATRICULE,
  },
];

export async function mockGetDocuments(f: DocumentFilters): Promise<DocumentGenere[]> {
  await delay();
  const q = (f.q ?? "").trim().toLowerCase();
  return DOCS.filter((d) => (f.type ? d.type === f.type : true))
    .filter(
      (d) =>
        !q ||
        d.nom.toLowerCase().includes(q) ||
        (d.nom_ar ?? "").toLowerCase().includes(q) ||
        d.dossierRef.toLowerCase().includes(q),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function mockTelechargerDocument(id: number) {
  await delay(500);
  const doc = DOCS.find((d) => d.id === id);
  if (!doc) throw new Error("NOT_FOUND");
  return { ok: true as const, nom: doc.nom };
}
