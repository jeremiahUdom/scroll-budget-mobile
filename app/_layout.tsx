import { AuthProvider } from '@/context/AuthContext'
import { UserPreferenceProvider } from '@/context/UserPreferenceContext';
import { Slot } from 'expo-router'

const AppLayout = () => {
  return (
    <UserPreferenceProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </UserPreferenceProvider>
  )
}

export default AppLayout;