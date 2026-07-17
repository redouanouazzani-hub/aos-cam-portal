/**
 * Campagne à délai (§4.4) — logique d'ouverture / fermeture AUTOMATIQUE.
 *
 * Contrat d'API prévu (Laravel — futurs endpoints) :
 *   GET  /campagnes/:activite
 *        → { activite, dateOuverture, dateLimite }
 *        Le STATUT n'est PAS renvoyé par l'API : il est CALCULÉ par le
 *        client comme par le serveur, à partir des deux dates.
 *
 *   PATCH /campagnes/:activite   (super-admin uniquement)
 *        body: { dateLimite }
 *        → { activite, dateOuverture, dateLimite }
 *
 * ─────────────────────────────────────────────────────────────────────────
 * RÈGLE DE CALCUL — statut = f(dateOuverture, dateLimite, now)
 *   • now  <  dateOuverture           → "a_venir"
 *   • dateOuverture ≤ now ≤ dateLimite → "ouverte"   (bornes INCLUSES)
 *   • now  >  dateLimite               → "fermee"
 *
 * ⚠ IMPORTANT — HORLOGE SERVEUR VS NAVIGATEUR :
 *   La fonction `computeStatut` prend `now` en paramètre. Côté FRONT (mock,
 *   auto-tests, démo), on peut y passer `new Date()` ou une date simulée
 *   pour valider la bascule. Côté LARAVEL, `now` DOIT être l'horloge du
 *   serveur (`now()` SQL ou `Carbon::now()`). NE JAMAIS faire confiance à
 *   la date du navigateur pour trancher l'ouverture/fermeture : un client
 *   peut avancer son horloge et re-soumettre après la limite. Le
 *   verrouillage définitif est TOUJOURS effectué côté serveur.
 * ─────────────────────────────────────────────────────────────────────────
 */
import { http, USE_MOCKS } from "./http";
import { mockGetCampagneRow, mockSetDateLimite } from "./mocks/campagne.mock";
import type { Campagne, CampagneStatutAuto, ModuleActivite } from "./types";

/**
 * Statut d'une campagne à partir de ses bornes et d'un instant `now`.
 * Fonction PURE — aucun état, aucun accès horloge implicite. `now` est
 * TOUJOURS injecté par l'appelant.
 */
export function computeStatut(
  dateOuverture: string,
  dateLimite: string,
  now: Date,
): CampagneStatutAuto {
  const t = now.getTime();
  const o = new Date(dateOuverture).getTime();
  const l = new Date(dateLimite).getTime();
  if (t < o) return "a_venir";
  if (t > l) return "fermee";
  return "ouverte";
}

export const campagneService = {
  computeStatut,
  /**
   * Lit les bornes d'une campagne et renvoie AUSSI le statut calculé à
   * `now` (par défaut : `new Date()`). En mode navigateur, `now` est
   * indicatif ; le serveur re-calcule le statut avec son horloge.
   */
  async getCampagne(
    activite: ModuleActivite,
    now: Date = new Date(),
  ): Promise<Campagne | null> {
    if (USE_MOCKS) {
      const row = await mockGetCampagneRow(activite);
      if (!row) return null;
      return {
        ...row,
        statut: computeStatut(row.dateOuverture, row.dateLimite, now),
      };
    }
    const { data } = await http.get<{
      activite: ModuleActivite;
      dateOuverture: string;
      dateLimite: string;
    }>(`/campagnes/${activite}`);
    return {
      ...data,
      statut: computeStatut(data.dateOuverture, data.dateLimite, now),
    };
  },

  /**
   * Modification de la `dateLimite` — RÉSERVÉE AU SUPER-ADMIN (§4.4).
   * Le mock accepte toute écriture ; côté Laravel, le contrôle de rôle
   * (policy `super-admin`) et l'audit sont OBLIGATOIRES.
   */
  async setDateLimite(
    activite: ModuleActivite,
    dateLimite: string,
    now: Date = new Date(),
  ): Promise<Campagne> {
    if (USE_MOCKS) {
      const row = await mockSetDateLimite(activite, dateLimite);
      return {
        ...row,
        statut: computeStatut(row.dateOuverture, row.dateLimite, now),
      };
    }
    const { data } = await http.patch<{
      activite: ModuleActivite;
      dateOuverture: string;
      dateLimite: string;
    }>(`/campagnes/${activite}`, { dateLimite });
    return {
      ...data,
      statut: computeStatut(data.dateOuverture, data.dateLimite, now),
    };
  },
};
