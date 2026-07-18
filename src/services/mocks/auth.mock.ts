import type { LoginPayload, LoginResponse, AuthUser } from "../types";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

interface MockUser extends AuthUser {
  password: string | null; // null => non activé
}

const USERS: MockUser[] = [
  {
    id: "u-1",
    matricule: "123456",
    password: "0000",
    fullName: "Karim Alaoui",
    role: "adherent",
    email: "karim@example.com",
  },
  {
    id: "u-2",
    matricule: "999999",
    password: "0000",
    fullName: "Youssef Benali",
    role: "super-admin",
    email: "youssef.benali@example.ma",
  },
  {
    id: "u-3",
    matricule: "555555",
    password: "0000",
    fullName: "Salma Idrissi",
    role: "gestionnaire",
    email: "salma.idrissi@example.ma",
  },
  {
    id: "u-4",
    matricule: "777777",
    password: null, // première connexion, aucun code défini
    fullName: "Nadia El Fassi",
    role: "adherent",
    email: "nadia.elfassi@example.ma",
    doit_activer: true,
  },
];

export async function mockLogin(payload: LoginPayload): Promise<LoginResponse> {
  await delay();

  // Cas première connexion : matricule connu, sans code défini.
  const firstLogin = USERS.find(
    (u) => u.matricule === payload.matricule && u.password === null,
  );
  if (firstLogin) {
    // On accepte n'importe quel mot de passe (ou même vide) pour laisser passer
    // vers l'écran d'activation ; en pratique côté Laravel, ce cas est traité
    // par un flag serveur, pas par comparaison de mot de passe.
    const { password: _pw, ...user } = firstLogin;
    return {
      token: `mock-token-${firstLogin.id}-${Date.now()}`,
      user: { ...user, doit_activer: true },
      doit_activer: true,
    };
  }

  const found = USERS.find(
    (u) => u.matricule === payload.matricule && u.password === payload.password,
  );
  if (!found) {
    const err = new Error("Invalid credentials");
    (err as unknown as { response: { status: number } }).response = { status: 401 };
    throw err;
  }
  const { password: _pw, ...user } = found;
  return { token: `mock-token-${found.id}-${Date.now()}`, user };
}

export async function mockMe(token: string | null): Promise<AuthUser> {
  await delay(150);
  if (!token) throw new Error("No token");
  const prefix = "mock-token-";
  const rest = token.startsWith(prefix) ? token.slice(prefix.length) : token;
  const lastDash = rest.lastIndexOf("-");
  const id = lastDash > 0 ? rest.slice(0, lastDash) : rest;
  const found = USERS.find((u) => u.id === id);
  if (!found) throw new Error("Invalid token");
  const { password: _pw, ...user } = found;
  return { ...user, doit_activer: found.password === null ? true : undefined };
}

export async function mockActivate(token: string | null, password: string): Promise<AuthUser> {
  await delay(500);
  if (!token) throw new Error("No token");
  const prefix = "mock-token-";
  const rest = token.startsWith(prefix) ? token.slice(prefix.length) : token;
  const lastDash = rest.lastIndexOf("-");
  const id = lastDash > 0 ? rest.slice(0, lastDash) : rest;
  const idx = USERS.findIndex((u) => u.id === id);
  if (idx < 0) throw new Error("Invalid token");
  USERS[idx] = { ...USERS[idx], password, doit_activer: false };
  const { password: _pw, ...user } = USERS[idx];
  return { ...user, doit_activer: false };
}
