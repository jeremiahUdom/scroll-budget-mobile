// services/userPreferences.ts
import { deleteData } from "../storage"

export const SCROLL_BUDGET_KEY = 'scrollBudgetInMs'
export const TRACKED_APPS_KEY = 'trackedApps'
export const HAS_ONBOARDED_KEY = 'hasOnboarded'
export const SCROLL_BUDGET_LAST_UPDATED_AT_KEY = 'scrollBudgetLastUpdatedAt'

// Reset local data
export const resetUserData = async () => {
  await deleteData(SCROLL_BUDGET_KEY)
  await deleteData(TRACKED_APPS_KEY)
  await deleteData(HAS_ONBOARDED_KEY)
}