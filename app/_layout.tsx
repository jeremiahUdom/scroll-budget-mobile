import { AuthProvider, useAuth } from '@/context/AuthContext'
import { UserPreferenceProvider } from '@/context/UserPreferenceContext';
import { Slot } from 'expo-router'
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from 'react';

// Run once, at module load — before any component renders
SplashScreen.preventAutoHideAsync()

const SplashGate = ({ children }: { children: React.ReactNode }) => {
  const { isInitialising } = useAuth()

  useEffect(() => {
    if (!isInitialising) {
      SplashScreen.hideAsync()
    }
  }, [isInitialising])

  if (isInitialising) {
    // returning null keeps the native splash covering the screen
    return null
  }

  return <>{children}</>
}

const AppLayout = () => {
  return (
    <UserPreferenceProvider>
      <AuthProvider>
        <SplashGate>
          <Slot />
        </SplashGate>
      </AuthProvider>
    </UserPreferenceProvider>
  )
}

export default AppLayout;