/**
 * Exceptions service — POUVOIRS D'EXCEPTION du gestionnaire (§4.7).
 *
 * RÈGLE MÉTIER (§4.7) — pouvoirs exceptionnels et traçabilité :
 *   • Ces actions ne peuvent être exercées que par un gestionnaire dont
 *     le module figure dans ses attributions RBAC.
 *   • CHAQUE action est OBLIGATOIREMENT journalisée côté serveur :
 *     login du gestionnaire + timestamp + matricule concerné + n° dossier
 *     + motif. La traçabilité n'est JAMAIS assurée uniquement au front.
 *   • L'AUTORISATION (RBAC + périmètre du module) est VÉRIFIÉE CÔTÉ
 *     SERVEUR (Laravel) sur chaque endpoint : le front ne fait qu'afficher
 *     les leviers ; toute décision de sécurité est retranchée au back.
 *
 * Contrats API (endpoints Laravel prévus) :
 *   POST /admin/exceptions/delegation-saisie
 *          { dossierId, gestionnaireId, payload } -> { id, statut }
 *   POST /admin/exceptions/reouverture-tardive
 *          { matricule, activiteId, dureeHeures, motif } -> { fenetreJusqua }
 *   POST /admin/exceptions/saisie-administrative
 *          { module, matricule, payload, motif } -> { id, statut: "valide" }
 *   POST /admin/exceptions/blacklist
 *          { matricule, motif } -> { matricule, actif: true, motif, depuis }
 *   POST /admin/exceptions/blacklist/lever
 *          { matricule, motif } -> { matricule, actif: false }
 *   POST /admin/exceptions/correction-apres-refus
 *          { dossierId, motifCorrection, pieceJointeNom? }
 *          -> { id, statut: "valide" }
 *
 * En mode démonstration (VITE_USE_MOCKS=true), un store en mémoire simule
 * l'état (blacklist, fenêtres exceptionnelles, journal d'audit).
 */

import { USE_MOCKS } from "./http";

export interface DelegationPayload {
  dossierId: number;
  gestionnaireId: string;
  contenu: string;
}

export interface ReouverturePayload {
  matricule: string;
  activiteId: string;
  dureeHeures: number;
  motif: string;
  gestionnaireId: string;
}

export interface SaisieAdminPayload {
  module: string;
  matricule: string;
  libelle: string;
  montant?: number;
  motif: string;
  gestionnaireId: string;
}

export interface BlacklistPayload {
  matricule: string;
  motif: string;
  gestionnaireId: string;
}

export interface CorrectionPayload {
  dossierId: number;
  motifCorrection: string;
  pieceJointeNom?: string;
  gestionnaireId: string;
}

export interface BlacklistState {
  matricule: string;
  actif: boolean;
  motif?: string;
  depuis?: string;
}

// Store en mémoire (mock)
const blacklistStore = new Map<string, BlacklistState>();
const fenetresExceptionnelles: Array<{
  matricule: string;
  activiteId: string;
  fenetreJusqua: string;
}> = [];

function delay<T>(v: T, ms = 400): Promise<T> {
  return new Promise((r) => setTimeout(() => r(v), ms));
}

export const exceptionsService = {
  async delegationSaisie(p: DelegationPayload) {
    if (USE_MOCKS) return delay({ id: p.dossierId, statut: "soumis" as const });
    throw new Error("Not implemented");
  },
  async reouvertureTardive(p: ReouverturePayload) {
    if (USE_MOCKS) {
      const jusqua = new Date(Date.now() + p.dureeHeures * 3600 * 1000).toISOString();
      fenetresExceptionnelles.push({
        matricule: p.matricule,
        activiteId: p.activiteId,
        fenetreJusqua: jusqua,
      });
      return delay({ fenetreJusqua: jusqua });
    }
    throw new Error("Not implemented");
  },
  async saisieAdministrative(p: SaisieAdminPayload) {
    if (USE_MOCKS)
      return delay({ id: Math.floor(Math.random() * 100000), statut: "valide" as const });
    throw new Error("Not implemented");
  },
  async blacklist(p: BlacklistPayload): Promise<BlacklistState> {
    if (USE_MOCKS) {
      const s: BlacklistState = {
        matricule: p.matricule,
        actif: true,
        motif: p.motif,
        depuis: new Date().toISOString(),
      };
      blacklistStore.set(p.matricule, s);
      return delay(s);
    }
    throw new Error("Not implemented");
  },
  async leverBlacklist(matricule: string): Promise<BlacklistState> {
    if (USE_MOCKS) {
      const s: BlacklistState = { matricule, actif: false };
      blacklistStore.set(matricule, s);
      return delay(s);
    }
    throw new Error("Not implemented");
  },
  getBlacklistState(matricule: string): BlacklistState | null {
    return blacklistStore.get(matricule) ?? null;
  },
  async corrigerApresRefus(p: CorrectionPayload) {
    if (USE_MOCKS) return delay({ id: p.dossierId, statut: "valide" as const });
    throw new Error("Not implemented");
  },
};
