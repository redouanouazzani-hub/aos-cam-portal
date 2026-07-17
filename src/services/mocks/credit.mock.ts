import type {
  Echeancier,
  EcheancierParams,
  EncoursInfo,
  PrimeAssurance,
  SoumettreCreditPayload,
  SoumettreCreditResponse,
} from "../types";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function mockGetEncours(): Promise<EncoursInfo> {
  await delay();
  return {
    actif: true,
    reference: "CR-2023-0417",
    soldeRestant: 18450,
    devise: "MAD",
  };
}

export async function mockGetPrimeAssurance(
  matricule: string,
): Promise<PrimeAssurance> {
  await delay();
  return {
    matricule,
    montant: 4820,
    devise: "MAD",
    source: "Fichier assureur — Wafa Assurance",
  };
}

function roundTo2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function mockSimulerEcheancier(
  params: EcheancierParams,
): Promise<Echeancier> {
  const { montant, methode, nbEcheances, moisDebut } = params;
  if (
    !montant ||
    montant <= 0 ||
    !nbEcheances ||
    nbEcheances <= 0 ||
    !moisDebut
  ) {
    return { devise: "MAD", lignes: [], totalPrelevements: 0 };
  }
  const stepMonths = methode === "semestrielle" ? 6 : 1;
  const parEcheance = roundTo2(Math.floor((montant / nbEcheances) * 100) / 100);
  const [yStr, mStr] = moisDebut.split("-");
  const y = Number(yStr);
  const m = Number(mStr) - 1; // 0-indexed

  const lignes = [];
  let cumul = 0;
  for (let i = 0; i < nbEcheances; i++) {
    const dt = new Date(Date.UTC(y, m + i * stepMonths, 5));
    const isLast = i === nbEcheances - 1;
    const montantLigne = isLast
      ? roundTo2(montant - cumul)
      : parEcheance;
    cumul = roundTo2(cumul + montantLigne);
    lignes.push({
      numero: i + 1,
      date: dt.toISOString(),
      montant: montantLigne,
    });
  }
  return { devise: "MAD", lignes, totalPrelevements: cumul };
}

let nextId = 4900;
export async function mockSoumettreCredit(
  _payload: SoumettreCreditPayload,
): Promise<SoumettreCreditResponse> {
  await delay(700);
  return {
    id: nextId++,
    statut: "soumis",
    autorisationPrecompte: {
      genere: false,
      message:
        "Une autorisation de précompte PDF sera générée après validation par le gestionnaire.",
      message_ar:
        "سيتم إصدار إذن الاقتطاع بصيغة PDF بعد المصادقة من طرف المدبّر.",
    },
  };
}
