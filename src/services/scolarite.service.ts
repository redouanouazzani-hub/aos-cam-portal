/**
 * Scolarité — Subvention de scolarité (campagne à délai).
 *
 * Contrat d'API prévu (Laravel — futurs endpoints) :
 *  GET  /me/scolarite/eligibilite?dateRentree=YYYY-MM-DD
 *       → { campagne: { statut, dateRentree, dateOuverture, dateFermeture },
 *           enfants: [{ id, prenom, nom, date_naissance, ageAnnees,
 *                       eligible, raison? }] }
 *  POST /me/scolarite
 *       payload: { dateRentree, enfants: [{ enfantId, certificatNom }] }
 *       → { id, statut: "soumis", reference }
 *
 * RÈGLE MÉTIER (§6.6) — FILTRE D'ÂGE STRICT :
 *   L'enfant doit avoir >= 5 ans 6 mois ET <= 26 ans À LA DATE DE RENTRÉE
 *   (1er septembre de l'année en cours). Le calcul d'âge se fait à la
 *   date de rentrée, jamais à la date du jour.
 *
 *   Ce filtre est APPLIQUÉ CÔTÉ FRONT pour l'UX (grisage, désactivation)
 *   MAIS SERA SYSTÉMATIQUEMENT REVÉRIFIÉ CÔTÉ SERVEUR (Laravel) avant
 *   toute création de dossier. Ne jamais faire confiance au seul filtrage
 *   client. Les enfants sont lus depuis la source officielle RH.
 *
 *   Le statut de campagne ("ouverte" / "fermee") est également autoritatif
 *   côté serveur : la fermeture bloque toute soumission.
 */
import { http, USE_MOCKS } from "./http";
import {
  mockGetEnfantsEligibles,
  mockSoumettreScolarite,
  currentDateRentree,
} from "./mocks/scolarite.mock";
import type {
  ScolariteEligibiliteResponse,
  ScolaritePayload,
  ScolariteResponse,
} from "./types";

export const scolariteService = {
  currentDateRentree,
  async getEnfantsEligibles(
    dateRentree: string,
  ): Promise<ScolariteEligibiliteResponse> {
    if (USE_MOCKS) return mockGetEnfantsEligibles(dateRentree);
    const { data } = await http.get<ScolariteEligibiliteResponse>(
      "/me/scolarite/eligibilite",
      { params: { dateRentree } },
    );
    return data;
  },
  async soumettreScolarite(
    payload: ScolaritePayload,
  ): Promise<ScolariteResponse> {
    if (USE_MOCKS) return mockSoumettreScolarite(payload);
    const { data } = await http.post<ScolariteResponse>(
      "/me/scolarite",
      payload,
    );
    return data;
  },
};
