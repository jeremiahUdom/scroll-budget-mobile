import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import GoBackBtn from '@/components/GoBackBtn'
import { useFocusEffect, useRouter } from 'expo-router'
import { fonts } from '@/constants/fonts'
import { typography } from '@/constants/typography'
import { useUserPreference } from '@/context/UserPreferenceContext'
import { formatDurationFromMilliseconds } from '@/utils/formatMinutesToTime'
import Ionicons from '@react-native-vector-icons/ionicons'
import AppButton from '@/components/AppButton'
import { getScrollBudgetLastUpdatedAt } from '@/utils/localStorage'

const ManageScrollBudget = () => {
  const router = useRouter()
  const { scrollBudgetInMs } = useUserPreference()
  const [canUpdateBudget, setCanUpdateBudget] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const fetchScrollBudgetLastUpdatedAt = async () => {
        const scrollBudgetLastUpdatedAt = await getScrollBudgetLastUpdatedAt()
        const today = new Date().toISOString()
        setCanUpdateBudget(scrollBudgetLastUpdatedAt === today)
      }

      fetchScrollBudgetLastUpdatedAt()
    }, [])
  )

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.backBtnWrapper}>
        <GoBackBtn 
          onButtonPressed={() => router.replace("/Settings")}
        />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.scrollBudgetContainer}>
          <Text style={styles.label}>Your scroll budget</Text>
          <Text style={styles.scrollBudget}>
            {formatDurationFromMilliseconds(scrollBudgetInMs)}/day
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoCardTitleContainer}>
            <Ionicons name="information-circle-outline" size={20} color={colors.darkMuted} />
            <Text style={styles.infoCardTitle}>Budgets can only change once a day</Text>
          </View>
          <Text style={styles.infoCardSubtitle}>
            This keeps your limit meaningful. Set it when you&apos;re clear-headed, not mid-scroll.
          </Text>
        </View>
      </View>


      {
        canUpdateBudget ? 
        <AppButton onButtonPressed={() => router.push("/AccountManagement/ManageScrollBudget")}>
          UpdateBudget
        </AppButton>
        : <View style={styles.lockedMessageContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.darkMuted} />
            <Text style={styles.lockedMessage}>Already updated today. Resets at midnight</Text>
          </View>
      }
    </SafeAreaView>
  )
}

export default ManageScrollBudget

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },

  backBtnWrapper: {
    marginBottom: spacing.lg,
  },

  mainContent: {
    flex: 1,
  },

  scrollBudgetContainer: {
    marginBottom: spacing.lg
  },

  label: {
    textTransform: "uppercase",
    color: colors.darkMuted,
    fontFamily: fonts.medium,
    fontSize: typography.small,
    marginBottom: spacing.xs,
  },

  scrollBudget: {
    fontSize: typography.heading,
    fontFamily: fonts.bold,
    color: colors.dark
  },

  infoCard: {
    width: "100%",
    paddingVertical: spacing.md,
    backgroundColor: colors.light,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
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
  },

  lockedMessageContainer: {
    flexDirection: "row",
    gap: spacing.xs,
  },

  lockedMessage: {
    fontFamily: fonts.regular,
    color: colors.darkMuted,
    fontSize: typography.label,
    textAlign: "center",
  }
})