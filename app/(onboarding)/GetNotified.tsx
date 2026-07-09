import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import { typography } from '@/constants/typography'
import { fonts } from '@/constants/fonts'
import { Link, useRouter } from 'expo-router'
import { requestNotificationsPermission } from '@/utils/notificationService'
import ErrorModal from '@/components/ErrorModal'
import NotificationToggle from '@/components/NotificationToggle'

const GetNotified = () => {
  const router = useRouter()
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  const enableNotification = async () => {
    try {
      const r = await requestNotificationsPermission()
      setIsEnabled(r)
      router.replace("/(tabs)") 
      return
    } catch (error) {
      console.error("could not enable notifications", error)
      setError("Coult not enable notifications. Please skip this step or try again")
      setShowError(true)
      return
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.progress}>
        <View style={styles.steps}>
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>

        <Link style={styles.skipText} href={"/SelectApps"} push>
          Skip
        </Link>
      </View>

      <View style={styles.header}>
        <Text style={styles.heading}>Stay on Track</Text>
        <Text style={styles.supportingText}>Get notified when you&apos;re close to your daily scroll budget and when you&apos;ve reached it. Notifications help you stay mindful without having to keep checking the app.</Text>  
        <NotificationToggle 
          enabled={isEnabled}
          onToggle={enableNotification}
        />
      </View>

      <ErrorModal 
        modalVisible={showError}
        error={error}
        onCloseModal={() => {
          setShowError(false)
          setError("")
        }}
      />
    </SafeAreaView>
  )
}

export default GetNotified

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },

  backBtn: {
    marginBottom: spacing.md,
  },

  progress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  steps: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primaryMuted, 
    borderRadius: 30,
  },

  stepText: {
    fontSize: typography.caption,
    fontFamily: fonts.medium,
    color: colors.primary,
  },

  skipText: {
    color: colors.darkMuted,
    fontSize: typography.body,
    fontFamily: fonts.medium,
    textAlign: "center",
  },

  header: {
    flex: 1,
  },

  heading: {
    fontSize: typography.heading,
    fontFamily: fonts.bold,
    color: colors.dark,
    marginBottom: spacing.sm,
  },

  supportingText: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.darkMuted,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  btn: {
    width: "48%",
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  btnDisable: {
    backgroundColor: colors.surfaceMuted,
  },

  btnText: {
    fontSize: typography.body,
    color: colors.surface,
    fontFamily: fonts.semiBold,
  },

  btnTextDisable: {
    color: colors.dark,
  }
})