import { UserPreferenceProvider } from '@/context/UserPreferenceContext'
import { getHasOnboarded } from '@/utils/userPreference'
import { Slot, Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

const SplashGate = ({ children }: { children: React.ReactNode }) => {
  const [isInitialising, setIsInitialising] = useState(true)
  const [hasOnboarded, setHasOnboarded] = useState(false)

  // when app mounts, check if user has onboarded
  useEffect(() => {
    const initialiseApp = async () => {
      // get 'hasOnboarded' from local storage
      const onboarded = await getHasOnboarded()
      setHasOnboarded(onboarded)
      setIsInitialising(false)
    }

    initialiseApp()
  }, [])

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