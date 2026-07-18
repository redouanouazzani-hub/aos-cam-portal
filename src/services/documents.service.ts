// documents.service.ts
// Côté Laravel, la génération PDF et l'application du filigrane sont FAITES SERVEUR
// (matricule + timestamp incrustés). Le endpoint de téléchargement vérifie que
// le document appartient bien à l'adhérent authentifié (scope par user_id) avant
// de renvoyer le flux binaire. Côté front, on ne fait qu'appeler le service.

import { http, USE_MOCKS } from "./http";
import { mockGetDocuments, mockTelechargerDocument } from "./mocks/documents.mock";
import type { DocumentGenere, DocumentFilters, DocumentType } from "./types";

export const documentsService = {
  async getDocuments(filters: DocumentFilters = {}): Promise<DocumentGenere[]> {
    if (USE_MOCKS) return mockGetDocuments(filters);
    const { data } = await http.get<DocumentGenere[]>("/me/documents", { params: filters });
    return data;
  },
  async telechargerDocument(id: number): Promise<{ ok: true; nom: string }> {
    if (USE_MOCKS) return mockTelechargerDocument(id);
    const { data } = await http.get<{ ok: true; nom: string }>(`/me/documents/${id}/download`);
    return data;
  },
};

export type { DocumentGenere, DocumentFilters, DocumentType };
