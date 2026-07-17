import { http, USE_MOCKS, getToken, setToken } from "./http";
import { mockLogin, mockMe } from "./mocks/auth.mock";
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
