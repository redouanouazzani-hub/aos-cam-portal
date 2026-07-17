import type {
  EstivageOptions,
  EstivagePayload,
  EstivageResponse,
} from "../types";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const CENTRES = [
  { id: "agadir", nom: "Centre d'Agadir", nom_ar: "مركز أكادير", ville: "Agadir" },
  { id: "ifrane", nom: "Centre d'Ifrane", nom_ar: "مركز إفران", ville: "Ifrane" },
  {
    id: "cabo",
    nom: "Résidence Cabo Negro",
    nom_ar: "إقامة كابو نيغرو",
    ville: "Tétouan",
  },
  {
    id: "saidia",
    nom: "Résidence Saïdia",
    nom_ar: "إقامة السعيدية",
    ville: "Saïdia",
  },
];

const PERIODES = [
  { id: "p1", debut: "2026-07-01", fin: "2026-07-14" },
  { id: "p2", debut: "2026-07-15", fin: "2026-07-28" },
  { id: "p3", debut: "2026-07-29", fin: "2026-08-11" },
  { id: "p4", debut: "2026-08-12", fin: "2026-08-25" },
];

export async function mockGetEstivageOptions(): Promise<EstivageOptions> {
  await delay(200);
  return {
    centres: CENTRES.map((c) => ({ ...c })),
    periodes: PERIODES.map((p) => ({ ...p })),
  };
}

let seq = 7000;
export async function mockSoumettreEstivage(
  _payload: EstivagePayload,
): Promise<EstivageResponse> {
  await delay(600);
  const id = ++seq;
  return { id, statut: "soumis", reference: `EST-${id}` };
}
