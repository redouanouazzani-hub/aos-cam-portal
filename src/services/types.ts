export type Role = "adherent" | "gestionnaire" | "super-admin";

export type ModuleActivite =
  | "logement"
  | "primes"
  | "credits"
  | "estivage"
  | "scolarite"
  | "voyages"
  | "medical"
  | "loisirs"
  | "inwi";

export interface Gestionnaire {
  id: string;
  matricule: string;
  fullName: string;
  modules: ModuleActivite[];
}

export interface PrerogativeRow {
  key: string;
  superAdmin: boolean;
  gestionnaire: boolean | "attribues";
}

export interface MatricePrerogatives {
  roles: Role[];
  prerogatives: PrerogativeRow[];
}

export type PassationDuree = "7j" | "15j" | "30j" | "90j";

export interface PassationPayload {
  fromId: string;
  toId: string;
  modules: ModuleActivite[];
  duree: PassationDuree;
}

export interface PassationResponse {
  id: number;
  fromId: string;
  toId: string;
  modules: ModuleActivite[];
  duree: PassationDuree;
  dateDebut: string;
  statut: "active";
}

// -------- Dispatching / instruction (§4.6) --------

export type DispatchAction = "valider" | "refuser" | "complement";

export interface DispatchLock {
  userId: string;
  fullName: string;
  since: string; // ISO
}

export interface DispatchPieceJointe {
  id: number;
  nom: string;
  nom_ar?: string;
  filigraneServeur: boolean;
}

export interface DispatchEcheance {
  numero: number;
  date: string;
  montant: number;
}

export interface DispatchEnfantSynthese {
  prenom: string;
  age: number;
  niveau: string;
  niveau_ar?: string;
}

export interface DispatchDossier {
  id: number;
  module: ModuleActivite;
  prestation: string;
  prestation_ar?: string;
  adherentNom: string;
  adherentMatricule: string;
  dateSoumission: string; // ISO
  statut: DemandeStatut;
  montant?: number;
  devise?: string;
  description?: string;
  description_ar?: string;
  piecesJointes: DispatchPieceJointe[];
  echeancier?: DispatchEcheance[];
  enfants?: DispatchEnfantSynthese[];
  lockedBy?: DispatchLock | null;
}

export interface FileAttenteResponse {
  dossiers: DispatchDossier[];
  parModule: Partial<Record<ModuleActivite, number>>;
}

export interface TransitionResponse {
  id: number;
  statut: DemandeStatut;
  auditEntry: {
    id: number;
    date: string;
    userId: string;
    userFullName: string;
    dossierId: number;
    action: DispatchAction;
    motif?: string;
  };
}

export interface AuthUser {
  id: string;
  matricule: string;
  fullName: string;
  role: Role;
  email?: string;
}

export interface LoginPayload {
  matricule: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

// -------- Profil (Vue 360°) --------

export interface Adherent {
  matricule: string;
  nom: string;
  prenom: string;
  cin: string;
  date_naissance: string;
  grade: string;
  direction: string;
}

export interface Enfant {
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string;
  sexe: "M" | "F";
}

export interface Contact {
  telephone: string;
  email: string;
  adresse: string;
}

export type ConjointStatut = "en_attente_validation" | "valide";

export interface Conjoint {
  nom: string;
  prenom: string;
  cin: string;
  statut: ConjointStatut;
}

export interface ProfileResponse {
  official: {
    adherent: Adherent;
    enfants: Enfant[];
  };
  declarative: {
    contact: Contact;
    conjoint: Conjoint | null;
  };
}

export type ContactPayload = Contact;
export type ConjointPayload = Omit<Conjoint, "statut">;

export interface DataClaimResponse {
  id: number;
  statut: "soumis";
}

// -------- Dashboard --------

export type DemandeStatut =
  | "brouillon"
  | "soumis"
  | "en_cours_instruction"
  | "complement_demande"
  | "valide"
  | "refuse"
  | "cloture"
  | "archive";

export interface DemandeRecente {
  id: number;
  prestation: string;
  prestation_ar?: string;
  date: string;
  statut: DemandeStatut;
}

export interface NotificationRecente {
  id: number;
  titre: string;
  titre_ar?: string;
  texte: string;
  texte_ar?: string;
  date: string;
  lu: boolean;
}

export interface Echeance {
  id: number;
  libelle: string;
  date: string;
  montant: number;
  devise: string;
}

export interface DashboardKpis {
  demandesEnCours: number;
  demandesValidees: number;
  notificationsNonLues: number;
  prochaineEcheance: {
    libelle: string;
    date: string;
    montant: number;
    devise: string;
  } | null;
}

export interface DashboardSummary {
  kpis: DashboardKpis;
  demandesRecentes: DemandeRecente[];
  notificationsRecentes: NotificationRecente[];
  echeances: Echeance[];
}

// -------- Demandes (liste + détail) --------

export interface DemandeListItem extends DemandeRecente {
  libelle?: string;
}

export interface DemandeTimelineStep {
  statut: DemandeStatut;
  date: string | null; // null = étape non encore franchie
  current?: boolean;
}

export interface DemandePieceJointe {
  id: number;
  nom: string;
  nom_ar?: string;
  date: string;
  filigraneServeur: boolean;
}

export interface DemandeHistoriqueEntry {
  id: number;
  date: string;
  action: string;
  action_ar?: string;
  auteur: string;
}

export interface DemandeDetail {
  id: number;
  prestation: string;
  prestation_ar?: string;
  description?: string;
  description_ar?: string;
  date: string;
  statut: DemandeStatut;
  timeline: DemandeTimelineStep[];
  piecesJointes: DemandePieceJointe[];
  historique: DemandeHistoriqueEntry[];
}

export type DemandeSort = "recent" | "ancien";

export interface DemandesFilters {
  statut?: DemandeStatut | "tous";
  sort?: DemandeSort;
  q?: string;
}

// -------- Crédit (dépôt d'une demande) --------

export type CreditType = "classique" | "anglais" | "auto" | "logement";
export type PrecompteMethode = "mensuelle" | "semestrielle";

export interface EncoursInfo {
  actif: boolean;
  reference?: string;
  soldeRestant?: number;
  devise?: string;
}

export interface PrimeAssurance {
  matricule: string;
  montant: number;
  devise: string;
  source: string;
}

export interface EcheancierParams {
  montant: number;
  methode: PrecompteMethode;
  nbEcheances: number;
  moisDebut: string; // YYYY-MM
}

export interface EcheancierRow {
  numero: number;
  date: string; // ISO
  montant: number;
}

export interface Echeancier {
  devise: string;
  lignes: EcheancierRow[];
  totalPrelevements: number;
}

export interface SoumettreCreditPayload {
  type: CreditType;
  echeancier: EcheancierParams;
  primeAssurance?: number;
  pieceJointeNom?: string;
}

export interface SoumettreCreditResponse {
  id: number;
  statut: "soumis";
  autorisationPrecompte: {
    genere: boolean;
    message: string;
    message_ar: string;
  };
}


