import React, { createContext, useState, useContext } from 'react'
import { App } from '@/types/App'
import { setScrollBudget, setTrackedApps } from '@/utils/userPreference'
type UserPreferenceContextType = {
  scrollBudgetInMs: number
  myTrackedApps: App[]
  updateTrackedApps: (apps: App[]) => Promise<void>
  updateScrollBudget: (budgetInMs: number) => Promise<void>
}

const UserPreferenceContext = createContext<UserPreferenceContextType | undefined>(undefined)

type Props = {
  children: React.ReactNode
}

// Use this hook to access the user info.
export const useUserPreference = () => {
  const value = useContext(UserPreferenceContext)

  if (!value) {
    throw new Error("useUserPreference must be wrapped in an <UserPreferenceProvider />")
  }

  return value
}

export const UserPreferenceProvider = ({ children }: Props) => {
  const [myTrackedApps, setMyTrackedApps] = useState<App[]>([])
  const [scrollBudgetInMs, setScrollBudgetInMs] = useState(0)

  const updateTrackedApps = async (apps: App[]) => {
    try {
      setMyTrackedApps(apps)
      await setTrackedApps(apps.map(app => app.packageName))

      return 
    } catch (error) {
      console.error("Failed to update tracked apps", error)
      throw new Error("Failed to update tracked apps. Please try again.")
    }
  }

  const updateScrollBudget = async (budgetInMs: number) => {
    try {
      setScrollBudgetInMs(budgetInMs)
      await setScrollBudget(budgetInMs)

      return
    } catch (error) {
      console.error("Failed to update scroll budget", error)
      throw new Error("Failed to update scroll budget. Please try again.")
    }
  }

  return (
    <UserPreferenceContext.Provider
      value={{ myTrackedApps, scrollBudgetInMs, updateTrackedApps, updateScrollBudget }}>
      {children}
    </UserPreferenceContext.Provider>
  )
}

export default UserPreferenceContext
