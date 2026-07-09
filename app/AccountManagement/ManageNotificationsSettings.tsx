import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import { typography } from '@/constants/typography'
import { fonts } from '@/constants/fonts'
import { Link, useRouter } from 'expo-router'
import { requestNotificationsPermission } from '@/utils/notificationService'

const GetNotified = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.main}>
      <View>
        <Text style={styles.heading}>Stay on Track</Text>
        <Text style={styles.supportingText}>Get notified when you&apos;re close to your daily scroll budget and when you&apos;ve reached it. Notifications help you stay mindful without having to keep checking the app.</Text>  
      </View>
      <View>
        <Text>Enable Notifications</Text>
      </View>
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
})