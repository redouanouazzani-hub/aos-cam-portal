/**
 * RBAC service — mocked front-office.
 *
 * Contrats API (endpoints Laravel prévus) :
 *   GET    /admin/rbac/gestionnaires                  -> Gestionnaire[]
 *   GET    /admin/rbac/matrice                        -> MatricePrerogatives
 *   GET    /admin/rbac/modules?userId={id}            -> ModuleActivite[]
 *   PUT    /admin/rbac/modules/{userId}               -> { modules: ModuleActivite[] }
 *   POST   /admin/rbac/passation                      -> { fromId, toId, modules, duree }
 *
 * Tous les appels réels passeront par la couche http (Bearer Sanctum).
 * En mode démonstration (VITE_USE_MOCKS=true), les fonctions ci-dessous
 * renvoient des données factices avec latence simulée.
 */

import { USE_MOCKS } from "./http";
import {
  mockGestionnaires,
  mockMatrice,
  mockModulesAutorises,
  mockAssignerModules,
  mockPassation,
} from "./mocks/rbac.mock";
import type {
  Gestionnaire,
  MatricePrerogatives,
  ModuleActivite,
  PassationPayload,
  PassationResponse,
} from "./types";

export const rbacService = {
  async getGestionnaires(): Promise<Gestionnaire[]> {
    if (USE_MOCKS) return mockGestionnaires();
    throw new Error("Not implemented");
  },
  async getMatriceDroits(): Promise<MatricePrerogatives> {
    if (USE_MOCKS) return mockMatrice();
    throw new Error("Not implemented");
  },
  async getModulesAutorises(userId: string): Promise<ModuleActivite[]> {
    if (USE_MOCKS) return mockModulesAutorises(userId);
    throw new Error("Not implemented");
  },
  async assignerModules(
    userId: string,
    modules: ModuleActivite[],
  ): Promise<{ userId: string; modules: ModuleActivite[] }> {
    if (USE_MOCKS) return mockAssignerModules(userId, modules);
    throw new Error("Not implemented");
  },
  async passation(payload: PassationPayload): Promise<PassationResponse> {
    if (USE_MOCKS) return mockPassation(payload);
    throw new Error("Not implemented");
  },
};
