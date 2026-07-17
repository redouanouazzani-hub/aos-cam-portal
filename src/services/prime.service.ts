/**
 * Primes — flux continu (§4.4), ouvert toute l'année.
 *
 * Contrat d'API prévu (Laravel — futurs endpoints) :
 *   POST /me/primes
 *        payload: { type: "mariage" | "naissance", justificatifNom: string }
 *        → { id, statut: "soumis", reference }
 *
 *   Règles serveur :
 *   - Justificatif OBLIGATOIRE (acte de mariage / extrait d'acte de
 *     naissance). Le contrôle front est indicatif ; le serveur DOIT
 *     rejeter toute requête sans pièce jointe.
 *   - Verrou anti-double-soumission : côté serveur, empêcher qu'un même
 *     adhérent soumette deux fois la même prime pour le même évènement
 *     (idempotency key ou vérification métier).
 */
import { http, USE_MOCKS } from "./http";
import { mockSoumettrePrime } from "./mocks/prime.mock";
import type { PrimePayload, PrimeResponse } from "./types";

export const primeService = {
  async soumettrePrime(payload: PrimePayload): Promise<PrimeResponse> {
    if (USE_MOCKS) return mockSoumettrePrime(payload);
    const { data } = await http.post<PrimeResponse>("/me/primes", payload);
    return data;
  },
};
