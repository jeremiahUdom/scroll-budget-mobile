import { AuthProvider } from '@/context/AuthContext'
import { Slot } from 'expo-router'

const AppLayout = () => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  )
}

export default AppLayout;