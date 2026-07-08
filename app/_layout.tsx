import { UserPreferenceProvider, useUserPreference } from '@/context/UserPreferenceContext'
import { Slot, Redirect } from 'expo-router'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

const SplashGate = ({ children }: { children: React.ReactNode }) => {
  const {isInitialising, hasOnboarded} = useUserPreference()

  useEffect(() => {
    // if app has finished initialising hide splash screen
    if (!isInitialising) {
      SplashScreen.hideAsync()
    }
  }, [isInitialising])


  if (isInitialising) {
    // returning null keeps the native splash covering the screen
    return null
  }

  // go to tabs if user has onboarded
  if (!hasOnboarded) {
    return <Redirect href="/Onboarding" />
  }

  return <>{children}</>
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