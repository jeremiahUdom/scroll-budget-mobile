import { StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import { Redirect } from 'expo-router'
import { spacing } from '@/constants/spacing'

const Index = () => {
  const {firebaseUser, isInitialising} = useAuth()

  if (isInitialising) {
    return (
      <SafeAreaView style={styles.main}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (firebaseUser) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/Onboarding" />;
}

export default Index

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    justifyContent: "center",
  },
})