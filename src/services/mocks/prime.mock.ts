import type { PrimePayload, PrimeResponse } from "../types";

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

let seq = 8100;
export async function mockSoumettrePrime(
  payload: PrimePayload,
): Promise<PrimeResponse> {
  await delay();
  const id = ++seq;
  const prefix = payload.type === "mariage" ? "PRM-M" : "PRM-N";
  return { id, statut: "soumis", reference: `${prefix}-${id}` };
}
