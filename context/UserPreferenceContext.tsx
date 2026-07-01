import React, { createContext, useState, useEffect, useContext } from 'react'
import { App } from '@/types/App'
import { getScrollBudget, getTrackedApps, setScrollBudget, setTrackedApps } from '@/utils/userPreference'
import { getInstalledApps } from '@sahil_sensei/react-native-app-usage'
import { getSelectedAppsApi } from '@/app/api/app.api'
import { useAuth } from './AuthContext'

type UserPreferenceContextType = {
  scrollBudgetInMs: number
  myTrackedApps: App[]
  loading: boolean
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
  const {isInitialising, firebaseUser, userProfile} = useAuth()
  const [myTrackedApps, setMyTrackedApps] = useState<App[]>([])
  const [scrollBudgetInMs, setScrollBudgetInMs] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isInitialising || !firebaseUser) {
      return
    }

    const initialiseApp = async () => {
      try {
        let fetchedTrackedApps = []
        let fetchedScrollBudgetInMs = 0
        // Get the scroll budget from local storage or set it to 0 if not found
        fetchedScrollBudgetInMs = await getScrollBudget() ?? 0

        if (fetchedScrollBudgetInMs === 0) {
          // If the scroll budget is not set on the local storage, fetch it from the user profile and set it in local storage
          fetchedScrollBudgetInMs = userProfile?.scrollBudgetInMs ?? 0
          setScrollBudget(fetchedScrollBudgetInMs)
        }

        // set the scroll budget in the state
        setScrollBudgetInMs(fetchedScrollBudgetInMs)

        // Get the tracked apps from local storage
        fetchedTrackedApps = await getTrackedApps()

        // fetch tracked apps from the API if not found
        if (fetchedTrackedApps.length === 0) {
          fetchedTrackedApps = await getSelectedAppsApi()
          setTrackedApps(fetchedTrackedApps)
        }

        // Get the installed apps
        const installedApps = await getInstalledApps()

        // filter installed apps based on the tracked apps
        const trackedAppsMetaData = installedApps.filter(
          app => fetchedTrackedApps.includes(app.packageName)
        )

        // set the tracked apps in the state
        setMyTrackedApps(trackedAppsMetaData)
      } catch (error) {
        console.error('Failed to load user preferences', error)
      } finally {
        setLoading(false)
      }
    }

    initialiseApp()
  }, [firebaseUser, isInitialising, userProfile?.scrollBudgetInMs])

  return (
    <UserPreferenceContext.Provider
      value={{ myTrackedApps, scrollBudgetInMs, loading }}>
      {children}
    </UserPreferenceContext.Provider>
  )
}

export default UserPreferenceContext
