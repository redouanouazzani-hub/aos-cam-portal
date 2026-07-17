/**
 * Convention Inwi — flux continu (§4.4), outil de COLLECTE DE COMMANDES.
 *
 * §6.9 : AUCUN document à téléverser côté adhérent. Le gestionnaire
 * prépare la carte SIM pour remise physique après validation.
 *
 * Contrat d'API prévu (Laravel — futurs endpoints) :
 *   GET  /inwi/forfaits
 *        → { forfaits: [{ id, libelle, libelle_ar?, prix, devise, description?, description_ar? }] }
 *   POST /me/inwi
 *        payload:
 *          { forfaitId: string, mode: "nouvelle_ligne" }
 *          | { forfaitId: string, mode: "portabilite", numeroPortabilite: string }
 *        → { id, statut: "soumis", reference }
 *
 *   Règles serveur :
 *   - Si mode = "portabilite" : numeroPortabilite requis, format MSISDN
 *     marocain (à valider côté serveur).
 *   - Verrou anti-double-soumission : idempotency / dedup côté serveur.
 */
import { http, USE_MOCKS } from "./http";
import { mockGetForfaits, mockSoumettreInwi } from "./mocks/inwi.mock";
import type { InwiForfaitsResponse, InwiPayload, InwiResponse } from "./types";

export const inwiService = {
  async getForfaits(): Promise<InwiForfaitsResponse> {
    if (USE_MOCKS) return mockGetForfaits();
    const { data } = await http.get<InwiForfaitsResponse>("/inwi/forfaits");
    return data;
  },
  async soumettreInwi(payload: InwiPayload): Promise<InwiResponse> {
    if (USE_MOCKS) return mockSoumettreInwi(payload);
    const { data } = await http.post<InwiResponse>("/me/inwi", payload);
    return data;
  },
};
