import { http, USE_MOCKS } from "./http";
import {
  mockGetProfile,
  mockUpdateContact,
  mockCreateConjoint,
  mockCreateDataClaim,
} from "./mocks/profile.mock";
import type {
  ProfileResponse,
  ContactPayload,
  ConjointPayload,
  Conjoint,
  Contact,
  DataClaimResponse,
} from "./types";

export const profileService = {
  async get(): Promise<ProfileResponse> {
    if (USE_MOCKS) return mockGetProfile();
    const { data } = await http.get<ProfileResponse>("/me/profile");
    return data;
  },

  async updateContact(payload: ContactPayload): Promise<Contact> {
    if (USE_MOCKS) return mockUpdateContact(payload);
    const { data } = await http.put<Contact>("/me/profile/contact", payload);
    return data;
  },

  async createConjoint(payload: ConjointPayload): Promise<Conjoint> {
    if (USE_MOCKS) return mockCreateConjoint(payload);
    const { data } = await http.post<Conjoint>("/me/conjoint", payload);
    return data;
  },

  /**
   * Signalement d'erreur sur données RH.
   * Le fichier justificatif est OBLIGATOIRE : sans fichier, aucune requête n'est émise.
   */
  async submitDataClaim(message: string, file: File | null): Promise<DataClaimResponse> {
    if (!file) {
      throw new Error("FILE_REQUIRED");
    }
    if (USE_MOCKS) return mockCreateDataClaim(message, file);
    const form = new FormData();
    form.append("message", message);
    form.append("fichier", file);
    const { data } = await http.post<DataClaimResponse>("/me/data-claims", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
