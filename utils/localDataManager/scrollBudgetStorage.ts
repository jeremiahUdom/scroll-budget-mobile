import { SCROLL_BUDGET_KEY, SCROLL_BUDGET_LAST_UPDATED_AT_KEY } from "./localStorage"
import { saveData, getData } from "../storage"

export const getScrollBudget = async (): Promise<number> => {
  const budget = await getData<number>(SCROLL_BUDGET_KEY)
  return budget ?? 0
}

export const setScrollBudget = async (budget: number) => {
  await saveData(SCROLL_BUDGET_KEY, budget)
  await saveData(SCROLL_BUDGET_LAST_UPDATED_AT_KEY, new Date().toISOString())
}

export const getScrollBudgetLastUpdatedAt = async () => {
  const scrollBudgetLastUpdatedAt = await getData<string>(SCROLL_BUDGET_LAST_UPDATED_AT_KEY)
  return scrollBudgetLastUpdatedAt
}