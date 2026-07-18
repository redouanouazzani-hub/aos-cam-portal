import { http, USE_MOCKS, getToken, setToken } from "./http";
import { mockLogin, mockMe, mockActivate } from "./mocks/auth.mock";
import type { AuthUser, LoginPayload, LoginResponse } from "./types";

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = USE_MOCKS
      ? await mockLogin(payload)
      : (await http.post<LoginResponse>("/auth/login", payload)).data;
    setToken(res.token);
    return res;
  },

  async me(): Promise<AuthUser> {
    if (USE_MOCKS) return mockMe(getToken());
    const { data } = await http.get<AuthUser>("/auth/me");
    return data;
  },

  /**
   * Activation du compte lors de la première connexion (§4.1).
   * Côté Laravel : endpoint dédié POST /auth/activate, le code est HACHÉ serveur
   * (bcrypt/argon2), jamais stocké en clair, et le flag `doit_activer` est
   * remis à false.
   */
  async activate(password: string): Promise<AuthUser> {
    if (USE_MOCKS) return mockActivate(getToken(), password);
    const { data } = await http.post<AuthUser>("/auth/activate", { password });
    return data;
  },

  async logout(): Promise<void> {
    try {
      if (!USE_MOCKS) await http.post("/auth/logout");
    } finally {
      setToken(null);
    }
  },

  isAuthenticated(): boolean {
    return !!getToken();
  },
};
