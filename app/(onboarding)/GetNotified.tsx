import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import { typography } from '@/constants/typography'
import { fonts } from '@/constants/fonts'
import { useRouter } from 'expo-router'
import { requestNotificationsPermission } from '@/utils/notificationService'
import ErrorModal from '@/components/ErrorModal'
import Ionicons from '@react-native-vector-icons/ionicons'
import AppButton from '@/components/AppButton'

const GetNotified = () => {
  const router = useRouter()
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)

  const enableNotification = async () => {
    try {
      await requestNotificationsPermission()
      router.replace("/(tabs)") 
      return
    } catch (error) {
      console.error("could not enable notifications", error)
      setError("An error occured while enabling notifications. lease try again or skip this step and enble it later from app settings.")
      setShowError(true)
      return
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.mainContent}>
        <View style={styles.progress}>
          <View style={styles.steps}>
            <Text style={styles.stepText}>Step 3 of 3</Text>
          </View>
        </View>

        <View>
          <Text style={styles.heading}>Know before you scroll too far</Text>
          <Text style={styles.supportingText}>Turn on notifications so we can nudge you as you get close to your daily limit.</Text>  

          <View style={styles.benefits}>
            <View style={styles.benefit}>
              <Ionicons name="warning-outline" size={25} color={colors.darkMuted} />
              <Text style={styles.text}>A heads up at 80% of your budget</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoCardTitleContainer}>
            <Ionicons name="bulb-outline" size={20} color={colors.darkMuted} />
            <Text style={styles.infoCardTitle}>Tip</Text>
          </View>
          <Text style={styles.infoCardSubtitle}>
            Keep Scroll Budget running in the background to receive usage reminders. Force-closing the app may prevent it from monitoring your usage and sending reminders.
          </Text>
        </View>
      </View>


      <View>
        <AppButton onButtonPressed={enableNotification}>
          Enable Notifications
        </AppButton>
        <Pressable onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.notNow}>Not now</Text>
        </Pressable>
      </View>

      <ErrorModal 
        modalVisible={showError}
        error={error}
        onCloseModal={() => {
          setShowError(false)
          setError("")
          router.push("/(tabs)")
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

  mainContent: {
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

  benefits: {
    gap: spacing.md,
  },

  benefit: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },

  text: {
    fontSize: typography.caption,
    color: colors.darkMuted,
    fontFamily: fonts.regular,
    maxWidth: 250
  },

  notNow: {
    alignSelf: "center",
    fontFamily: fonts.semiBold,
    color: colors.darkMuted,
    fontSize: typography.body,
    marginTop: spacing.lg,
  },

  infoCard: {
    width: "100%",
    paddingVertical: spacing.md,
    backgroundColor: colors.primaryMuted,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.lg,
  },

  infoCardTitleContainer: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },

  infoCardTitle: {
    fontFamily: fonts.medium,
    color: colors.darkMuted,
    fontSize: typography.label,
  },

  infoCardSubtitle: {
    fontFamily: fonts.regular,
    color: colors.darkMuted,
    fontSize: typography.label,
    lineHeight: 22, 
  },
})