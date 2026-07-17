import { http, USE_MOCKS } from "./http";
import {
  mockGetEncours,
  mockGetPrimeAssurance,
  mockSimulerEcheancier,
  mockSoumettreCredit,
} from "./mocks/credit.mock";
import type {
  Echeancier,
  EcheancierParams,
  EncoursInfo,
  PrimeAssurance,
  SoumettreCreditPayload,
  SoumettreCreditResponse,
} from "./types";

export const creditService = {
  async getEncours(): Promise<EncoursInfo> {
    if (USE_MOCKS) return mockGetEncours();
    const { data } = await http.get<EncoursInfo>("/me/credits/encours");
    return data;
  },
  async getPrimeAssurance(matricule: string): Promise<PrimeAssurance> {
    if (USE_MOCKS) return mockGetPrimeAssurance(matricule);
    const { data } = await http.get<PrimeAssurance>(
      `/me/credits/prime-assurance`,
      { params: { matricule } },
    );
    return data;
  },
  async simulerEcheancier(params: EcheancierParams): Promise<Echeancier> {
    if (USE_MOCKS) return mockSimulerEcheancier(params);
    const { data } = await http.post<Echeancier>(
      "/me/credits/simuler",
      params,
    );
    return data;
  },
  async soumettreCredit(
    payload: SoumettreCreditPayload,
  ): Promise<SoumettreCreditResponse> {
    if (USE_MOCKS) return mockSoumettreCredit(payload);
    const { data } = await http.post<SoumettreCreditResponse>(
      "/me/credits",
      payload,
    );
    return data;
  },
};
