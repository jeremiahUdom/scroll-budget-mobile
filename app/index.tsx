import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { Redirect } from 'expo-router'

const Index = () => {
  const {firebaseUser} = useAuth()
  return <Redirect href={firebaseUser ? "/(tabs)" : "/Onboarding"} />;
}

export default Index