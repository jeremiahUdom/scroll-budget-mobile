// services/userPreferences.ts
import { saveData, getData, deleteData } from "./storage"

const SCROLL_BUDGET_KEY = 'scrollBudgetInMs'
const TRACKED_APPS_KEY = 'trackedApps'

// Scroll Budget
export const getScrollBudget = async (): Promise<number> => {
  const budget = await getData<number>(SCROLL_BUDGET_KEY)
  return budget ?? 0
}

export const setScrollBudget = (budget: number) =>
  saveData(SCROLL_BUDGET_KEY, budget)

// Tracked Apps
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

// Reset user data
export const resetUserData = async () => {
  await deleteData(SCROLL_BUDGET_KEY)
  await deleteData(TRACKED_APPS_KEY)
}