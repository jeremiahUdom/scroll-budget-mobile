// import { Dimensions, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native'
// import React, { useCallback, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import Ionicons from '@react-native-vector-icons/ionicons'
// import { colors } from '@/constants/colors'
// import { spacing } from '@/constants/spacing'
// import { typography } from '@/constants/typography'
// import { fonts } from '@/constants/fonts'
// import { useUserPreference } from '@/context/UserPreferenceContext'
// import { useFocusEffect } from 'expo-router'
// import { WeeklyAnalyticsResponse } from '@/types/WeeklyAnalytics'
// import { getWeeklyAnalyticsApi } from '@/api/analytics.api'
// import { formatDurationFromMilliseconds } from '@/utils/formatMinutesToTime'
// import AppUsageCard from '@/components/AppUsageCard'
// import {BarChart} from "react-native-gifted-charts"
// import { getWeekDateRange } from '@/utils/getWeekDateRange'
// import ErrorModal from '@/components/ErrorModal'

// const chartWidth = Dimensions.get("screen").width - spacing.lg

// const Insight = () => {
//   const { myTrackedApps } = useUserPreference()
//   const [weeklyAnalytics, setWeeklyAnalytics] = useState<WeeklyAnalyticsResponse | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [showError, setShowError] = useState(false)

//   useFocusEffect(
//     useCallback(() => {
//       const getWeeklyAnalytics = async () => {
//         try {
//           setLoading(true)
//           // 1. Fetch weekly analytics data from the server
//           const response = await getWeeklyAnalyticsApi()

//           // 2. Update the state with the fetched data
//           setWeeklyAnalytics(response)
//         } catch (error) {
//           console.error("Analytics error:", error)
//           if (error instanceof Error) {
//             setError(error.message)
//             setShowError(true)
//             return
//           }

//           setError("An error occured while loading your dashboard. Please try again")
//           setShowError(true)
//           return
//         } finally {
//           setLoading(false)
//         }
//       }

//       getWeeklyAnalytics()
//     }, [])
//   )

//   // Determine the trend direction
//   const trendDirection = weeklyAnalytics?.weeklyTrend.direction

//   // Determine the trend icon
//   const trendIcon =
//     trendDirection === "up"
//       ? "arrow-up"
//       : trendDirection === "down"
//       ? "arrow-down"
//       : "remove"

//   // Determine the trend color
//   const trendColor =
//     trendDirection === "up"
//       ? colors.danger      
//       : trendDirection === "down"
//       ? colors.primary  
//       : colors.darkMuted

//   // Determine the most used app
//   const mostUsedApp =
//     weeklyAnalytics?.mostUsedApp
//       ? myTrackedApps.find(
//           app =>
//             app.packageName ===
//             weeklyAnalytics?.mostUsedApp?.packageName
//         )
//       : null

//   // Combine the most used app data with the weekly analytics data
//   const mostUsedAppStat =
//     mostUsedApp && weeklyAnalytics?.mostUsedApp
//       ? {
//           ...mostUsedApp,
//           totalTimeInForeground:
//             weeklyAnalytics.mostUsedApp.totalScreenTimeInMs,
//         }
//       : null

//   const today = new Date().toDateString()

//   // Prepare chart data for the bar chart
//   const chartData =
//     weeklyAnalytics?.dailyUsage.map(day => {
//       const hours = day.totalScreenTimeInMs / (1000 * 60 * 60)

//       let color = colors.primary

//       if (!day.onTrack) {
//         color = hours >= 2 ? colors.danger : colors.warning // orange when near limit
//       }

//       const isToday =
//         new Date(day.date).toDateString() === today

//       return {
//         value: hours,

//         label: new Date(day.date).toLocaleDateString("en-US", {
//           weekday: "narrow",
//         }),

//         frontColor: color,

//         opacity: isToday ? 1 : 0.55,

//         labelTextStyle: {
//           fontFamily: isToday ? fonts.semiBold : fonts.medium,
//           color: isToday ? colors.dark : colors.darkMuted,
//         },

//         topLabelComponent:
//           hours > 0
//             ? () => (
//                 <Text style={styles.chartTopLabel}>
//                   {hours.toFixed(1)}h
//                 </Text>
//               )
//             : undefined,
//       }
//     }) ?? []

//   return (
//     <SafeAreaView style={styles.main}>
//       <ScrollView contentContainerStyle={styles.scrollView}>
//         {loading && (
//           <ActivityIndicator
//             size="small"
//             color={colors.primary}
//           />
//         )}
//         <View>
//           <Text style={styles.title}>Weekly Analytics</Text>
//           <Text style={styles.heading}>This Week</Text>
//           <Text style={styles.dateRange}>{getWeekDateRange()}</Text>
//         </View>

//         <View style={styles.cardRow}>
//           <View style={styles.card}>
//             <Text style={styles.label}>Daily avg</Text>
//             <Text style={styles.value}>{weeklyAnalytics ? formatDurationFromMilliseconds(weeklyAnalytics.dailyAverageInMs) : '-'}</Text>
//           </View>
//           <View style={styles.card}>
//             <Text style={styles.label}>Days on track</Text>
//             <Text style={styles.value}>{weeklyAnalytics ? `${weeklyAnalytics.daysOnTrack}/7` : '-'}</Text>
//           </View>
//         </View>

//         <View style={styles.totalCard}>
//           <Text style={styles.label}>Total this week</Text>
//           <Text style={styles.value}>{weeklyAnalytics ? formatDurationFromMilliseconds(weeklyAnalytics.totalScreenTimeInMs) : '-'}</Text>
//           <View style={styles.trendRow}>
//             {weeklyAnalytics?.weeklyTrend && (
//               <>
//                 <Ionicons name={trendIcon} size={20} color={trendColor} />
//                 <Text style={styles.trend}> {weeklyAnalytics.weeklyTrend.percentage}% vs last week</Text>
//               </>
//             )}
//           </View>
//         </View>

//         <View style={styles.chartCard}>
//           <Text style={styles.label}>Daily Usage</Text>
//           <View style={{position: "relative"}}>
//             <BarChart
//               data={chartData}
//               width={chartWidth}
//               height={220}
//               maxValue={24}
//               barWidth={40}
//               spacing={18}
//               barBorderTopLeftRadius={8}
//               barBorderTopRightRadius={8}
//               hideYAxisText
//               xAxisThickness={2}
//               yAxisThickness={2}
//               xAxisColor={colors.surfaceMuted}
//               yAxisColor={colors.surfaceMuted}
//               hideRules={false}
//               rulesColor={colors.surfaceMuted}
//               yAxisTextStyle={{
//                 color: colors.darkMuted,
//                 fontFamily: fonts.medium,
//                 fontSize: typography.small,
//               }}
//               xAxisLabelTextStyle={{
//                 color: colors.darkMuted,
//                 fontFamily: fonts.medium,
//                 fontSize: typography.small,
//               }}
//               showScrollIndicator
//               scrollAnimation
//               scrollToEnd

//             />
//           </View>
//         </View>

//         <View style={styles.mostUsedApp}>
//           <Text style={styles.label}>Most used app</Text>
//           {
//             !weeklyAnalytics ? (
//               <ActivityIndicator size="small" color={colors.primary} />
//             ) :
//             mostUsedAppStat ? (
//               <AppUsageCard
//                 app={mostUsedAppStat}
//                 scrollBudgetInMs={weeklyAnalytics?.totalScreenTimeInMs ?? 0}
//               />
//             ) : (
//               <Text style={styles.trend}>No app usage this week.</Text>
//             )
//           }
//         </View>
//       </ScrollView>

//       <ErrorModal
//         modalVisible={showError}
//         onCloseModal={() => setShowError(false)}
//         error={error}
//       />
//     </SafeAreaView>
//   )
// }

// export default Insight

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     backgroundColor: colors.surface,
//     padding: spacing.lg,
//     justifyContent: "space-around",
//   },

//   loaderContainer: {
//     flex: 1,
//     backgroundColor: colors.surface,
//     padding: spacing.lg,
//   },

//   scrollView: {
//     gap: spacing.lg,
//   },

//   title: {
//     fontSize: typography.body,
//     fontFamily: fonts.regular,
//     color: colors.darkMuted,
//     textTransform: "uppercase",
//   },

//   heading: {
//     fontSize: typography.heading,
//     fontFamily: fonts.semiBold,
//     color: colors.dark,
//   },

//   dateRange: {
//     fontSize: typography.body,
//     fontFamily: fonts.regular,
//     color: colors.darkMuted,
//   },

//   cardRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   card: {
//     width: "48%",
//     height: 100,
//     borderWidth: 1,
//     borderColor: colors.surfaceMuted,
//     borderRadius: 10,
//     paddingHorizontal: spacing.md,
//     justifyContent: "space-evenly",
//     backgroundColor: colors.light,
//   },

//   label: {
//     textTransform: "uppercase",
//     color: colors.darkMuted,
//     fontFamily: fonts.medium,
//     fontSize: typography.small,
//   },

//   value: {
//     fontSize: typography.button,
//     color: colors.dark,
//     fontFamily: fonts.semiBold,
//   },

//   totalCard: {
//     height: 150,
//     borderWidth: 1,
//     borderColor: colors.surfaceMuted,
//     borderRadius: 10,
//     paddingHorizontal: spacing.md,
//     justifyContent: "space-evenly",
//     backgroundColor: colors.light,
//   },

//   trendRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   trend: {
//     fontFamily: fonts.regular,
//     fontSize: typography.caption,
//     color: colors.darkMuted,
//   },

//   chartCard: {
//     gap: spacing.md,  
//   },

//   mostUsedApp: {
//     gap: spacing.xs,
//   },

//   chartTopLabel: {
//     color: colors.darkMuted,
//     fontFamily: fonts.medium,
//     fontSize: typography.small,
//   },
// })