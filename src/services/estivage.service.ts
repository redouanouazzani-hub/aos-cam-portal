/**
 * Estivage — dépôt des vœux dans une campagne à délai (§4.4).
 *
 * Contrat d'API prévu (Laravel — futurs endpoints) :
 *   GET  /estivage/options
 *        → { centres: [{id,nom,ville}], periodes: [{id,debut,fin}] }
 *   POST /estivage
 *        payload: { centreId, periodeId, participants: number[] }
 *        → { id, statut: "soumis", reference }
 *
 *   Le serveur DOIT re-vérifier l'ouverture de la campagne (campagne
 *   service, §4.4) AVANT toute création. Toute soumission après
 *   `dateLimite` (horloge serveur) est refusée, même si le client
 *   ne l'a pas encore constaté.
 */
import { http, USE_MOCKS } from "./http";
import {
  mockGetEstivageOptions,
  mockSoumettreEstivage,
} from "./mocks/estivage.mock";
import type {
  EstivageOptions,
  EstivagePayload,
  EstivageResponse,
} from "./types";

export const estivageService = {
  async getOptions(): Promise<EstivageOptions> {
    if (USE_MOCKS) return mockGetEstivageOptions();
    const { data } = await http.get<EstivageOptions>("/estivage/options");
    return data;
  },
  async soumettreEstivage(payload: EstivagePayload): Promise<EstivageResponse> {
    if (USE_MOCKS) return mockSoumettreEstivage(payload);
    const { data } = await http.post<EstivageResponse>("/estivage", payload);
    return data;
  },
};
