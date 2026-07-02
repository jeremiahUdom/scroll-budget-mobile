import { authApi } from "./client";

export const storeSelectedAppsApi = async (packageNames: string[]): Promise<boolean> => {
  const response = await authApi.post<{success: boolean}>("/apps/me", {packageNames})

  return response.data.success;
}

export const updateSelectedAppsApi = async (packageNames: string[]): Promise<boolean> => {
  const response = await authApi.patch<{success: boolean}>("/apps/me", {packageNames})

  return response.data.success;
}

export const getSelectedAppsApi = async (): Promise<string[]> => {
  const response = await authApi.get<{success: boolean, apps: string[]}>("/apps/me")

  return response.data.apps;
}