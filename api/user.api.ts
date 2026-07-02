import { authApi } from "./client"
import { UserProfile } from "@/types/UserProfile"

export const createProfile = async (): Promise<UserProfile> => {
  const response = await authApi.post<{success: boolean, user: UserProfile}>("/users/me/profile")

  return response.data.user
}

export const fetchMyData = async (): Promise<{user: UserProfile, trackedApps: string[]}> => {
  const response = await authApi.get<{success: boolean, user: UserProfile, trackedApps: string[]}>("/users/me")

  return {
    user: response.data.user,
    trackedApps: response.data.trackedApps
  }
}

export const updateProfile = async (userName: string): Promise<UserProfile> => {
  const response = await authApi.patch<{success: boolean, user: UserProfile}>("/users/me/profile", {name: userName})

  return response.data.user
}

export const updateMyBudget = async (value: number): Promise<UserProfile> => {
  const response = await authApi.patch<{success: boolean, user: UserProfile}>("/users/me/budget", {budgetInMs: value})

  return response.data.user
}