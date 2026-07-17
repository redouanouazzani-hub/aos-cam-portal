import type { LoginPayload, LoginResponse, AuthUser } from "../types";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const USERS: Array<AuthUser & { password: string }> = [
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
];

export async function mockLogin(payload: LoginPayload): Promise<LoginResponse> {
  await delay();
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
  const id = token.split("-")[2];
  const found = USERS.find((u) => u.id === id);
  if (!found) throw new Error("Invalid token");
  const { password: _pw, ...user } = found;
  return user;
}
