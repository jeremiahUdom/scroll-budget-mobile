import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import { spacing } from '@/constants/spacing'
import { colors } from '@/constants/colors'
import { fonts } from '@/constants/fonts'
import { typography } from '@/constants/typography'
import { AppUsageStat } from '@/types/App'
import { formatDurationFromMilliseconds } from '@/utils/formatMinutesToTime'

interface Props {
  scrollBudgetInMs: number
  app: AppUsageStat,
  customStyle?: ViewStyle
}

const AppUsageCard = ({scrollBudgetInMs, app, customStyle}: Props) => {
  const hasBudget = scrollBudgetInMs > 0;
  const totalTimeInForeground = formatDurationFromMilliseconds(app.totalTimeInForeground)
  const budgetUsagePercentage = hasBudget
    ? Math.round((app.totalTimeInForeground / scrollBudgetInMs) * 100)
    : 0;
  const progressWidth = Math.min(
    budgetUsagePercentage,
    100
  )
  
  return (
    <View style={[styles.appUsageCard, customStyle]}>
      <View style={styles.appIconBox}>
        <Image 
          source={{ uri: app.icon }}
          style={styles.appIcon}
          resizeMode='contain'
        />
      </View>
      <View style={styles.appInfoContainer}>

        <View style={styles.infoItem}>
          <Text style={styles.appTitle}>{app.name}</Text>
          <Text style={styles.statValue}>{totalTimeInForeground} used</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progressWidth}%` }]} />
          </View>
            <Text style={styles.statValue}>
              {hasBudget ? `${budgetUsagePercentage}%` : "--"}
            </Text>
        </View>
      </View>
    </View>
  )
}

export default AppUsageCard

const styles = StyleSheet.create({
  appUsageCard: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  appIconBox: {
    width: 45,
    height: 45,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  appIcon: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },

  appInfoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  appTitle: {
    fontFamily: fonts.medium,
    fontSize: typography.body,
    color: colors.dark,
  },

  statValue: {
    fontFamily: fonts.regular,
    fontSize: typography.caption,
    color: colors.darkMuted,
  },

  progressBarContainer: {
    width: "80%",
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 15,
  },

  progressBarFill: {
    width: 0,
    height: "100%",
    borderRadius: 15,
    backgroundColor: colors.primary,
  },
})