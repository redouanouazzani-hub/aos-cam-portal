export type Role = "adherent" | "gestionnaire" | "super-admin";

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

