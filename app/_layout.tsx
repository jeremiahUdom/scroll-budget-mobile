import { UserPreferenceProvider, useUserPreference } from '@/context/UserPreferenceContext'
import { Slot } from 'expo-router'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { registerBackgroundTask } from '@/utils/backgroundTask'
import { initialiseNotifications } from '@/utils/notificationService'
import "@/utils/notificationHandler"

SplashScreen.preventAutoHideAsync()

const SplashGate = ({ children }: { children: React.ReactNode }) => {
  const { isInitialising } = useUserPreference() 

  useEffect(() => {
    const initialiseApp = async () => {
      try {
        await initialiseNotifications()
        await registerBackgroundTask()
      } catch(error) {
        console.error(error)
      }
    }

    initialiseApp()
  }, [])

  useEffect(() => {
    if (!isInitialising) {
      SplashScreen.hideAsync()
    }
  }, [isInitialising])

  if (isInitialising) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}

const AppLayout = () => {
  
  return (
    <UserPreferenceProvider>
      <SplashGate>
        <Slot />
      </SplashGate>
    </UserPreferenceProvider>
  )
}

export default AppLayout