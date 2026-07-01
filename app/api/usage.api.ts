import { AppUsageStat } from "@/types/App";
import { authApi } from "./client";

export const sendUsageToServer = async (apps: AppUsageStat[]): Promise<boolean> => {
  const payload = apps.map(app => ({
    packageName: app.packageName,
    totalForegroundInMs: app.totalTimeInForeground
  }))

  const response = await authApi.post<{success: boolean}>("/usage/me/session", payload)

  return response.data.success
}