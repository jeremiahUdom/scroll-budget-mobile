import { TRACKED_APPS_KEY } from "./localStorage"
import { getData, saveData } from "../storage"

export const setTrackedApps = (apps: string[]) => 
  saveData(TRACKED_APPS_KEY, apps)

export const getTrackedApps = async (): Promise<string[]> => {
  const apps = await getData<string[]>(TRACKED_APPS_KEY)
  return apps ?? []
}

export const addTrackedApp = async (appPackageName: string) => {
  const current = await getTrackedApps()

  if (current.includes(appPackageName)) {
    return
  }

  return setTrackedApps([...current, appPackageName])
}

export const removeTrackedApp = async (appPackageName: string) => {
  const current = await getTrackedApps()
  return setTrackedApps(current.filter((app: string) => app !== appPackageName))
}