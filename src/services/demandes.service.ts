import { http, USE_MOCKS } from "./http";
import { mockGetDemandeById, mockGetDemandes } from "./mocks/demandes.mock";
import type { DemandeDetail, DemandeListItem, DemandesFilters } from "./types";

export const demandesService = {
  async getDemandes(filters: DemandesFilters = {}): Promise<DemandeListItem[]> {
    if (USE_MOCKS) return mockGetDemandes(filters);
    const { data } = await http.get<DemandeListItem[]>("/me/demandes", { params: filters });
    return data;
  },
  async getDemandeById(id: number): Promise<DemandeDetail | null> {
    if (USE_MOCKS) return mockGetDemandeById(id);
    const { data } = await http.get<DemandeDetail>(`/me/demandes/${id}`);
    return data;
  },
};
