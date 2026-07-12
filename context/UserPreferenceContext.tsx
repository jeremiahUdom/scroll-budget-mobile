import React, { createContext, useState, useContext, useEffect } from 'react'
import { App } from '@/types/App'
import { getHasOnboarded, getScrollBudget, getTrackedApps, setHasOnboardedValue, setScrollBudget, setScrollBudgetLastUpdatedAt, setTrackedApps } from '@/utils/localStorage'
import { getInstalledApps } from '@sahil_sensei/react-native-app-usage'
type UserPreferenceContextType = {
  scrollBudgetInMs: number
  myTrackedApps: App[]
  updateTrackedApps: (apps: App[]) => Promise<void>
  updateScrollBudget: (budgetInMs: number) => Promise<void>
  isInitialising: boolean
  hasOnboarded: boolean
  updateHasOnboarded: (value: boolean) => Promise<void>
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
  const [isInitialising, setIsInitialising] = useState(true)
  const [hasOnboarded, setHasOnboarded] = useState(false)

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
      await setScrollBudgetLastUpdatedAt()

      return
    } catch (error) {
      console.error("Failed to update scroll budget", error)
      throw new Error("Failed to update scroll budget. Please try again.")
    }
  }

  const updateHasOnboarded = async (value: boolean) => {
    try {
      setHasOnboarded(value)
      await setHasOnboardedValue(value)
    } catch (error) {
      console.error("Failed to update onboarding status", error)
      throw new Error("Failed to update onboarding status. Please try again.")
    }
  }

  useEffect(() => {
    const initialiseApp = async () => {
      try {
        // fetch user installed apps on startup from @sahil_sensei/react-native-app-usage
        const installedApps = await getInstalledApps()

        // get tracked apps from async storage 
        const trackedApps = await getTrackedApps()
        // filter installed apps to get user tracked apps(if any) from it and store data in the context
        setMyTrackedApps(installedApps.filter(app => trackedApps.includes(app.packageName)))

        // get users budget from async storage
        const budget = await getScrollBudget()

        // store users budget in the context
        setScrollBudgetInMs(budget)

        // get hasOnboarded from async storage
        const hasOnboarded = await getHasOnboarded()

        // store hasOnboarded in context
        setHasOnboarded(hasOnboarded)
      } catch (error) {
        console.error("App initialisation failed", error)
      } finally {
        setIsInitialising(false)
      }
    }

    initialiseApp()
  }, [])

  return (
    <UserPreferenceContext.Provider
      value={{ myTrackedApps, scrollBudgetInMs, updateTrackedApps, updateScrollBudget, isInitialising, hasOnboarded, updateHasOnboarded }}>
      {children}
    </UserPreferenceContext.Provider>
  )
}

export default UserPreferenceContext
