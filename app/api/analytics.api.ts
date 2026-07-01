import { WeeklyAnalyticsResponse } from "@/types/WeeklyAnalytics";
import { authApi } from "./client";

export const getWeeklyAnalyticsApi = async (): Promise<WeeklyAnalyticsResponse> => {
  const response = await authApi.get<{success: boolean, weeklyAnalytics: WeeklyAnalyticsResponse}>("/analytics/me/weekly")

  return response.data.weeklyAnalytics;
}