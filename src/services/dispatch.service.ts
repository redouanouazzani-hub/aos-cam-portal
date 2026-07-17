/**
 * Dispatch service — file de dispatching + instruction des dossiers.
 *
 * RÈGLE MÉTIER (§4.6) — dispatching équitable et anti-collision :
 *   • Un gestionnaire ne traite QUE les dossiers dont le module figure dans
 *     ses attributions RBAC.
 *   • "Traiter le suivant" = extraire le dossier EN ATTENTE le plus ANCIEN
 *     parmi les modules attribués, non verrouillé par un autre gestionnaire.
 *   • Deux gestionnaires ne doivent JAMAIS recevoir le même dossier :
 *     l'attribution ET l'anti-collision sont VÉRIFIÉES CÔTÉ SERVEUR
 *     (transactions + verrous applicatifs Laravel), jamais uniquement au front.
 *   • Le front ne fait qu'afficher l'état ; toute action passe par le serveur
 *     qui journalise (login gestionnaire + timestamp + n° dossier + motif).
 *
 * Contrats API (endpoints Laravel prévus) :
 *   GET    /admin/dispatch/file?gestionnaireId={id}
 *            -> { dossiers: DispatchDossier[], parModule: Record<...> }
 *   POST   /admin/dispatch/suivant   { gestionnaireId }
 *            -> DispatchDossier | null   (verrou posé côté serveur)
 *   POST   /admin/dispatch/verrouiller { dossierId, gestionnaireId }
 *            -> DispatchLock
 *   POST   /admin/dispatch/transition  { dossierId, action, motif? }
 *            -> TransitionResponse
 *
 * En mode démonstration (VITE_USE_MOCKS=true), les fonctions ci-dessous
 * simulent le comportement en mémoire (file + verrous + journal).
 */

import { USE_MOCKS } from "./http";
import {
  mockGetFileAttente,
  mockTraiterSuivant,
  mockVerrouillerDossier,
  mockTransitionDossier,
  mockGetDossierById,
} from "./mocks/dispatch.mock";
import type {
  DispatchAction,
  DispatchDossier,
  DispatchLock,
  FileAttenteResponse,
  TransitionResponse,
} from "./types";

export const dispatchService = {
  async getFileAttente(gestionnaireId: string): Promise<FileAttenteResponse> {
    if (USE_MOCKS) return mockGetFileAttente(gestionnaireId);
    throw new Error("Not implemented");
  },
  async traiterSuivant(gestionnaireId: string): Promise<DispatchDossier | null> {
    if (USE_MOCKS) return mockTraiterSuivant(gestionnaireId);
    throw new Error("Not implemented");
  },
  async verrouillerDossier(
    dossierId: number,
    gestionnaireId: string,
  ): Promise<DispatchLock> {
    if (USE_MOCKS) return mockVerrouillerDossier(dossierId, gestionnaireId);
    throw new Error("Not implemented");
  },
  async transitionDossier(
    dossierId: number,
    action: DispatchAction,
    motif: string | undefined,
    gestionnaireId: string,
  ): Promise<TransitionResponse> {
    if (USE_MOCKS)
      return mockTransitionDossier(dossierId, action, motif, gestionnaireId);
    throw new Error("Not implemented");
  },
  async getDossierById(id: number): Promise<DispatchDossier | null> {
    if (USE_MOCKS) return mockGetDossierById(id);
    throw new Error("Not implemented");
  },
};
