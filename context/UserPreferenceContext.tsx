import React, { createContext, useState, useContext, useEffect } from 'react'
import { App } from '@/types/App'
import { getScrollBudget, getTrackedApps, setScrollBudget, setTrackedApps } from '@/utils/userPreference'
import { getInstalledApps } from '@sahil_sensei/react-native-app-usage'
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

  useEffect(() => {
    const initialiseApp = async () => {
      try {
        const installedApps = await getInstalledApps()
        const trackedApps = await getTrackedApps()
        setMyTrackedApps(installedApps.filter(app => trackedApps.includes(app.packageName)))
        const budget = await getScrollBudget() 
        setScrollBudgetInMs(budget)
      } catch (error) {
        console.error("App initialisation failed", error)
        throw new Error("Failed to fetch app data. Please try again.")
      }
    }

    initialiseApp()
  }, [])

  return (
    <UserPreferenceContext.Provider
      value={{ myTrackedApps, scrollBudgetInMs, updateTrackedApps, updateScrollBudget }}>
      {children}
    </UserPreferenceContext.Provider>
  )
}

export default UserPreferenceContext
