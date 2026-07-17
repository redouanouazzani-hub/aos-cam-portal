import type {
  DispatchAction,
  DispatchDossier,
  DispatchLock,
  FileAttenteResponse,
  ModuleActivite,
  TransitionResponse,
} from "../types";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// Attribution modules par gestionnaire (aligné avec rbac.mock).
// u-3 = Salma (555555) → credits + scolarite
// u-2 = Youssef (super-admin) → tous
const MODULES_PAR_USER: Record<string, ModuleActivite[] | "all"> = {
  "u-2": "all",
  "u-3": ["credits", "scolarite"],
};

let dossiers: DispatchDossier[] = [
  {
    id: 4802,
    module: "scolarite",
    prestation: "Aide à la scolarité",
    prestation_ar: "المساعدة على التمدرس",
    adherentNom: "Karim Alaoui",
    adherentMatricule: "123456",
    dateSoumission: "2026-07-02T09:12:00Z",
    statut: "soumis",
    montant: 3200,
    devise: "MAD",
    description: "Aide annuelle pour la rentrée scolaire — deux enfants.",
    description_ar: "مساعدة سنوية بمناسبة الدخول المدرسي — طفلان.",
    piecesJointes: [
      { id: 1, nom: "attestation-inscription-1.pdf", nom_ar: "شهادة التسجيل 1.pdf", filigraneServeur: true },
      { id: 2, nom: "attestation-inscription-2.pdf", nom_ar: "شهادة التسجيل 2.pdf", filigraneServeur: true },
    ],
    enfants: [
      { prenom: "Yasmine", age: 12, niveau: "1ère année collège", niveau_ar: "السنة الأولى إعدادي" },
      { prenom: "Adam", age: 8, niveau: "CE3", niveau_ar: "السنة الثالثة ابتدائي" },
    ],
    lockedBy: null,
  },
  {
    id: 4901,
    module: "credits",
    prestation: "Demande de crédit véhicule",
    prestation_ar: "طلب قرض سيارة",
    adherentNom: "Karim Alaoui",
    adherentMatricule: "123456",
    dateSoumission: "2026-07-05T14:33:00Z",
    statut: "soumis",
    montant: 45000,
    devise: "MAD",
    description: "Crédit auto — 24 échéances mensuelles.",
    description_ar: "قرض سيارة — 24 قسطاً شهرياً.",
    piecesJointes: [
      { id: 1, nom: "devis-vehicule.pdf", nom_ar: "تسعيرة السيارة.pdf", filigraneServeur: true },
      { id: 2, nom: "autorisation-precompte.pdf", nom_ar: "إذن الاقتطاع.pdf", filigraneServeur: true },
    ],
    echeancier: [
      { numero: 1, date: "2026-08-05", montant: 1875 },
      { numero: 2, date: "2026-09-05", montant: 1875 },
      { numero: 3, date: "2026-10-05", montant: 1875 },
      { numero: 4, date: "2026-11-05", montant: 1875 },
    ],
    lockedBy: null,
  },
  {
    id: 4915,
    module: "credits",
    prestation: "Crédit classique",
    prestation_ar: "قرض عادي",
    adherentNom: "Salima Naciri",
    adherentMatricule: "204512",
    dateSoumission: "2026-07-08T10:04:00Z",
    statut: "soumis",
    montant: 30000,
    devise: "MAD",
    piecesJointes: [
      { id: 1, nom: "engagement.pdf", nom_ar: "التزام.pdf", filigraneServeur: true },
    ],
    echeancier: [
      { numero: 1, date: "2026-08-01", montant: 1250 },
      { numero: 2, date: "2026-09-01", montant: 1250 },
    ],
    // Verrouillé par un autre gestionnaire — démo anti-collision
    lockedBy: {
      userId: "u-13",
      fullName: "Nadia Berrada",
      since: "2026-07-17T08:35:00Z",
    },
  },
  {
    id: 4930,
    module: "scolarite",
    prestation: "Bourse scolarité — enseignement supérieur",
    prestation_ar: "منحة التمدرس — التعليم العالي",
    adherentNom: "Hassan Bouzid",
    adherentMatricule: "187003",
    dateSoumission: "2026-07-11T11:20:00Z",
    statut: "soumis",
    piecesJointes: [
      { id: 1, nom: "attestation-fac.pdf", nom_ar: "شهادة الكلية.pdf", filigraneServeur: true },
    ],
    enfants: [
      { prenom: "Sara", age: 19, niveau: "Licence 2", niveau_ar: "الإجازة السنة الثانية" },
    ],
    lockedBy: null,
  },
  {
    id: 4942,
    module: "logement",
    prestation: "Aide au logement",
    prestation_ar: "المساعدة على السكن",
    adherentNom: "Ilham Chraibi",
    adherentMatricule: "156220",
    dateSoumission: "2026-07-12T09:00:00Z",
    statut: "soumis",
    montant: 12000,
    devise: "MAD",
    piecesJointes: [
      { id: 1, nom: "contrat-bail.pdf", nom_ar: "عقد الكراء.pdf", filigraneServeur: true },
    ],
    lockedBy: null,
  },
  {
    id: 4955,
    module: "estivage",
    prestation: "Colonie de vacances — été 2026",
    prestation_ar: "المخيم الصيفي — صيف 2026",
    adherentNom: "Fouad Sabri",
    adherentMatricule: "199801",
    dateSoumission: "2026-07-14T15:45:00Z",
    statut: "soumis",
    piecesJointes: [],
    enfants: [
      { prenom: "Ismail", age: 10, niveau: "CM2", niveau_ar: "السنة السادسة ابتدائي" },
    ],
    lockedBy: null,
  },
  {
    id: 4960,
    module: "medical",
    prestation: "Aide médicale exceptionnelle",
    prestation_ar: "مساعدة طبية استثنائية",
    adherentNom: "Mounia Sefiani",
    adherentMatricule: "168331",
    dateSoumission: "2026-07-15T08:12:00Z",
    statut: "soumis",
    montant: 8500,
    devise: "MAD",
    piecesJointes: [
      { id: 1, nom: "facture-clinique.pdf", nom_ar: "فاتورة العيادة.pdf", filigraneServeur: true },
    ],
    lockedBy: null,
  },
  {
    id: 4972,
    module: "voyages",
    prestation: "Voyage organisé — Turquie",
    prestation_ar: "رحلة منظمة — تركيا",
    adherentNom: "Réda Fettah",
    adherentMatricule: "201155",
    dateSoumission: "2026-07-16T13:40:00Z",
    statut: "soumis",
    piecesJointes: [],
    lockedBy: null,
  },
];

// Journal d'audit (mock)
const auditLog: TransitionResponse["auditEntry"][] = [];

function modulesFor(gestionnaireId: string): ModuleActivite[] | "all" {
  return MODULES_PAR_USER[gestionnaireId] ?? [];
}

function isAssignable(d: DispatchDossier, modulesUser: ModuleActivite[] | "all"): boolean {
  if (d.lockedBy) return false;
  if (d.statut !== "soumis") return false;
  if (modulesUser === "all") return true;
  return modulesUser.includes(d.module);
}

function visible(d: DispatchDossier, modulesUser: ModuleActivite[] | "all"): boolean {
  if (modulesUser === "all") return true;
  return modulesUser.includes(d.module);
}

export async function mockGetFileAttente(
  gestionnaireId: string,
): Promise<FileAttenteResponse> {
  await delay();
  const mods = modulesFor(gestionnaireId);
  const filtered = dossiers
    .filter((d) => visible(d, mods))
    .filter((d) => d.statut === "soumis")
    .sort((a, b) => a.dateSoumission.localeCompare(b.dateSoumission));

  const parModule: Partial<Record<ModuleActivite, number>> = {};
  for (const d of filtered) {
    parModule[d.module] = (parModule[d.module] ?? 0) + 1;
  }

  return {
    dossiers: filtered.map((d) => ({ ...d })),
    parModule,
  };
}

export async function mockTraiterSuivant(
  gestionnaireId: string,
): Promise<DispatchDossier | null> {
  await delay();
  const mods = modulesFor(gestionnaireId);
  // Le plus ancien assignable
  const candidate = [...dossiers]
    .filter((d) => isAssignable(d, mods))
    .sort((a, b) => a.dateSoumission.localeCompare(b.dateSoumission))[0];
  if (!candidate) return null;
  // Anti-collision : pose le verrou (côté serveur en réel).
  candidate.lockedBy = {
    userId: gestionnaireId,
    fullName: gestionnaireLabel(gestionnaireId),
    since: new Date().toISOString(),
  };
  candidate.statut = "en_cours_instruction";
  return { ...candidate };
}

export async function mockVerrouillerDossier(
  dossierId: number,
  gestionnaireId: string,
): Promise<DispatchLock> {
  await delay(120);
  const d = dossiers.find((x) => x.id === dossierId);
  if (!d) throw new Error("Dossier introuvable");
  if (d.lockedBy && d.lockedBy.userId !== gestionnaireId) {
    const err = new Error("Dossier déjà verrouillé");
    (err as unknown as { code: string }).code = "LOCKED";
    throw err;
  }
  d.lockedBy = {
    userId: gestionnaireId,
    fullName: gestionnaireLabel(gestionnaireId),
    since: new Date().toISOString(),
  };
  if (d.statut === "soumis") d.statut = "en_cours_instruction";
  return { ...d.lockedBy };
}

export async function mockTransitionDossier(
  dossierId: number,
  action: DispatchAction,
  motif: string | undefined,
  gestionnaireId: string,
): Promise<TransitionResponse> {
  await delay();
  const d = dossiers.find((x) => x.id === dossierId);
  if (!d) throw new Error("Dossier introuvable");

  if (action === "valider") d.statut = "valide";
  else if (action === "refuser") d.statut = "refuse";
  else if (action === "complement") d.statut = "complement_demande";

  // Libère le verrou après transition terminale ou complément
  d.lockedBy = null;

  const entry: TransitionResponse["auditEntry"] = {
    id: auditLog.length + 1,
    date: new Date().toISOString(),
    userId: gestionnaireId,
    userFullName: gestionnaireLabel(gestionnaireId),
    dossierId,
    action,
    motif,
  };
  auditLog.push(entry);

  return { id: d.id, statut: d.statut, auditEntry: entry };
}

export async function mockGetDossierById(id: number): Promise<DispatchDossier | null> {
  await delay(120);
  const d = dossiers.find((x) => x.id === id);
  return d ? { ...d } : null;
}

function gestionnaireLabel(id: string): string {
  const map: Record<string, string> = {
    "u-2": "Youssef Benali",
    "u-3": "Salma Idrissi",
    "u-13": "Nadia Berrada",
  };
  return map[id] ?? "Gestionnaire";
}
