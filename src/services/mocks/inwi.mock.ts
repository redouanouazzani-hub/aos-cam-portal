import type {
  InwiForfaitsResponse,
  InwiPayload,
  InwiResponse,
} from "../types";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const FORFAITS = [
  {
    id: "f-essentiel",
    libelle: "Forfait Essentiel",
    libelle_ar: "الباقة الأساسية",
    prix: 99,
    devise: "MAD",
    description: "5 h d'appels + 10 Go Internet",
    description_ar: "5 ساعات مكالمات + 10 جيجابايت أنترنت",
  },
  {
    id: "f-confort",
    libelle: "Forfait Confort",
    libelle_ar: "الباقة المريحة",
    prix: 149,
    devise: "MAD",
    description: "Appels illimités + 30 Go Internet",
    description_ar: "مكالمات غير محدودة + 30 جيجابايت أنترنت",
  },
  {
    id: "f-premium",
    libelle: "Forfait Premium",
    libelle_ar: "الباقة المتميزة",
    prix: 249,
    devise: "MAD",
    description: "Appels illimités + 100 Go + roaming",
    description_ar: "مكالمات غير محدودة + 100 جيجابايت + التجوال",
  },
];

export async function mockGetForfaits(): Promise<InwiForfaitsResponse> {
  await delay(250);
  return { forfaits: FORFAITS.map((f) => ({ ...f })) };
}

let seq = 9100;
export async function mockSoumettreInwi(
  _payload: InwiPayload,
): Promise<InwiResponse> {
  await delay();
  const id = ++seq;
  return { id, statut: "soumis", reference: `INW-${id}` };
}
