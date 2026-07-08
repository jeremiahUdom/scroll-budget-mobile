import { getHourlyUsage } from "@sahil_sensei/react-native-app-usage"

export const getUsageStatForTrackedApps = async (packageNames: string[]) => {
  const usageStats = (
    await Promise.all(
      packageNames.map(async (packageName) => {
        const totalTimeInForeground = (
          await getHourlyUsage(packageName)
        ).reduce(
          (sum, hour) => sum + hour.durationMs,
          0
        )

        return {
          packageName: packageName,
          totalTimeInForeground,
        }
      })
    )
  ).sort(
    (a, b) =>
      b.totalTimeInForeground -
      a.totalTimeInForeground
  )

  return usageStats
}