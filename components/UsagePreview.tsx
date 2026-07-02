import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'
import React from 'react'
import { colors } from '@/constants/colors'
import { fonts } from '@/constants/fonts'
import { typography } from '@/constants/typography'
import { formatDurationFromMilliseconds} from '@/utils/formatMinutesToTime'
import { spacing } from '@/constants/spacing'

interface Props {
  scrollBudgetInMs: number
  budgetUsedInMs: number
  isDashboardLoading?: boolean
}

const UsagePreview = ({
  scrollBudgetInMs = 0,
  budgetUsedInMs = 0,
  isDashboardLoading = false
}: Props) => {
  const hasBudget = scrollBudgetInMs > 0;
  const percentageUsed = hasBudget
    ? Math.min((budgetUsedInMs / scrollBudgetInMs) * 100, 100)
    : 0;
    
  const radius = 100
  const strokeWidth = 15
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = hasBudget
    ? circumference - (percentageUsed / 100) * circumference
    : circumference;

  const getBudgetLeft = (scrollBudgetInMs: number, budgetUsedInMs: number) => {
    const budgetLeft = Math.max(scrollBudgetInMs - budgetUsedInMs, 0)
    
    return formatDurationFromMilliseconds(budgetLeft)
  }

  const getRemark = (percentageUsed: number) => {
    if (percentageUsed === 0) {
      return "Ready to start"
    }

    if (percentageUsed >= 100) {
      return percentageUsed === 100
        ? "Budget reached"
        : "Over budget"
    }

    if (percentageUsed >= 80) {
      return "Almost there"
    }

    return "On track"
  }

  return (
    <View style={styles.container}>
      <Svg
        width={radius * 2 + strokeWidth}
        height={radius * 2 + strokeWidth}
        style={styles.svg}
      >
        <G transform={`rotate(-90 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}>
          <Circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke={colors.surfaceMuted}
            strokeWidth={strokeWidth}
            fill="none"
          />
        
          <Circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={styles.timeUsed}>{isDashboardLoading ? '-' : formatDurationFromMilliseconds(budgetUsedInMs)}</Text>
        <Text style={styles.label}>used today</Text>
        {hasBudget ? (
          <>
            {percentageUsed < 100 && (
              <Text style={styles.timeLeft}>
                {isDashboardLoading ? '-' : getBudgetLeft(scrollBudgetInMs, budgetUsedInMs)} left
              </Text>
            )}

            <Text style={styles.status}>
              {isDashboardLoading ? '-' : getRemark(percentageUsed)}
            </Text>
          </>
        ) : (
          <Text style={styles.status}>
            Set a daily budget
          </Text>
        )}
      </View>
    </View>
  )
}

export default UsagePreview

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  svg: {
    marginBottom: -10,
  },

  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },

  timeUsed: {
    fontFamily: fonts.semiBold,
    fontSize: 32,
    color: colors.dark,
  },

  label: {
    fontFamily: fonts.regular,
    fontSize: typography.caption,
    color: colors.darkMuted,
    marginTop: 4,
  },

  timeLeft: {
    fontFamily: fonts.regular,
    fontSize: typography.caption,
    color: colors.darkMuted,
    marginTop: 2,
  },

  status: {
    fontFamily: fonts.medium,
    fontSize: typography.caption,
    color: colors.primary,
    marginTop: spacing.sm,
    width: 150,
    textAlign: 'center',
  },
})