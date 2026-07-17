import { http, USE_MOCKS } from "./http";
import { mockGetDashboardSummary } from "./mocks/dashboard.mock";
import type { DashboardSummary } from "./types";

export const dashboardService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    if (USE_MOCKS) return mockGetDashboardSummary();
    const { data } = await http.get<DashboardSummary>("/me/dashboard");
    return data;
  },
};
