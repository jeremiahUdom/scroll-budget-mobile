// services/userPreferences.ts
import { saveData, getData, deleteData } from "./storage"

const SCROLL_BUDGET_KEY = 'scrollBudgetInMs'
const TRACKED_APPS_KEY = 'trackedApps'
const HAS_ONBOARDED_KEY = 'hasOnboarded'
const SCROLL_BUDGET_LAST_UPDATED_AT_KEY = 'scrollBudgetLastUpdatedAt'

export const setScrollBudgetLastUpdatedAt = async () => 
  await saveData(SCROLL_BUDGET_LAST_UPDATED_AT_KEY, new Date().toISOString())

export const getScrollBudgetLastUpdatedAt = async () => {
  const scrollBudgetLastUpdatedAt = await getData<string>(SCROLL_BUDGET_LAST_UPDATED_AT_KEY)
  return scrollBudgetLastUpdatedAt
}

export const setHasOnboardedValue = async (value: boolean) => 
  await saveData(HAS_ONBOARDED_KEY, value)

export const getHasOnboarded = async (): Promise<boolean> => {
  const hasOnboarded = await getData<boolean>(HAS_ONBOARDED_KEY)
  return hasOnboarded ?? false
}

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
  await deleteData(HAS_ONBOARDED_KEY)
}