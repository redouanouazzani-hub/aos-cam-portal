import type {
  Gestionnaire,
  MatricePrerogatives,
  ModuleActivite,
  PassationPayload,
  PassationResponse,
} from "../types";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const ALL_MODULES: ModuleActivite[] = [
  "logement",
  "primes",
  "credits",
  "estivage",
  "scolarite",
  "voyages",
  "medical",
  "loisirs",
  "inwi",
];

// 8 gestionnaires. Le gestionnaire connecté (u-3, matricule 555555)
// n'a accès qu'aux modules Crédits + Scolarité (attribution simulée).
const GESTIONNAIRES: Gestionnaire[] = [
  { id: "u-3", matricule: "555555", fullName: "Salma Idrissi", modules: ["credits", "scolarite"] },
  { id: "u-10", matricule: "610001", fullName: "Rachid El Amrani", modules: ["logement", "primes"] },
  { id: "u-11", matricule: "610002", fullName: "Fatima Zahra Bennani", modules: ["estivage", "voyages"] },
  { id: "u-12", matricule: "610003", fullName: "Omar Cherkaoui", modules: ["medical", "loisirs"] },
  { id: "u-13", matricule: "610004", fullName: "Nadia Berrada", modules: ["credits", "primes"] },
  { id: "u-14", matricule: "610005", fullName: "Hicham Tazi", modules: ["scolarite", "inwi"] },
  { id: "u-15", matricule: "610006", fullName: "Amina Ouazzani", modules: ["logement"] },
  { id: "u-16", matricule: "610007", fullName: "Mehdi Fassi", modules: ["voyages", "loisirs", "inwi"] },
];

const MATRICE: MatricePrerogatives = {
  roles: ["super-admin", "gestionnaire"],
  prerogatives: [
    { key: "consulter_dossiers", superAdmin: true, gestionnaire: "attribues" },
    { key: "instruire_dossiers", superAdmin: true, gestionnaire: "attribues" },
    { key: "valider_dossiers", superAdmin: true, gestionnaire: "attribues" },
    { key: "creer_campagnes", superAdmin: true, gestionnaire: false },
    { key: "gerer_comptes", superAdmin: true, gestionnaire: false },
    { key: "assigner_modules", superAdmin: true, gestionnaire: false },
    { key: "passation", superAdmin: true, gestionnaire: false },
    { key: "extraction_precomptes", superAdmin: true, gestionnaire: false },
    { key: "consulter_audit", superAdmin: true, gestionnaire: false },
    { key: "exporter_reporting", superAdmin: true, gestionnaire: "attribues" },
  ],
};

export async function mockGestionnaires(): Promise<Gestionnaire[]> {
  await delay();
  return GESTIONNAIRES.map((g) => ({ ...g, modules: [...g.modules] }));
}

export async function mockMatrice(): Promise<MatricePrerogatives> {
  await delay(150);
  return MATRICE;
}

export async function mockModulesAutorises(userId: string): Promise<ModuleActivite[]> {
  await delay(100);
  const g = GESTIONNAIRES.find((x) => x.id === userId);
  return g ? [...g.modules] : [];
}

export async function mockAssignerModules(
  userId: string,
  modules: ModuleActivite[],
): Promise<{ userId: string; modules: ModuleActivite[] }> {
  await delay();
  const g = GESTIONNAIRES.find((x) => x.id === userId);
  if (g) g.modules = [...modules];
  return { userId, modules };
}

export async function mockPassation(p: PassationPayload): Promise<PassationResponse> {
  await delay();
  return {
    id: Math.floor(Math.random() * 100000),
    fromId: p.fromId,
    toId: p.toId,
    modules: p.modules,
    duree: p.duree,
    dateDebut: new Date().toISOString(),
    statut: "active",
  };
}
