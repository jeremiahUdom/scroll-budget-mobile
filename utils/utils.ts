import * as BackgroundTask from "expo-background-task"
import * as TaskManager from "expo-task-manager"
import * as Notifications from "expo-notifications"
import { getUsageStatForTrackedApps } from "./getUsageStatForTrackedApps"
import { getScrollBudget, getTrackedApps } from "./userPreference"
import { getNotifiedThresholdsForToday, setNotifiedThresholdsForToday } from "./notification"

const BACKGROUND_TASK_IDENTIFIER = "CHECK_USAGE_STAT"
const MINIMUM_INTERVAL = 5

// Thresholds checked from highest to lowest so we never double-fire
// in a single run (e.g. jumping from 75% -> 95% only notifies once, for 90%).
const THRESHOLDS = [100, 90, 80] as const

const NOTIFICATION_COPY: Record<(typeof THRESHOLDS)[number], { title: string; body: string }> = {
  100: {
    title: "Scroll Budget Reached",
    body: "You've hit your scroll budget for today",
  },
  90: {
    title: "Almost at your Scroll Budget",
    body: "You've used 90% of your scroll budget for today",
  },
  80: {
    title: "Scroll Budget Warning",
    body: "You've used 80% of your scroll budget for today",
  },
}

export const initialiseBackgroundTask = async (
  innerAppMountedPromise: Promise<void>
) => {
  TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
    await innerAppMountedPromise

    try {
      const myTrackedApps = await getTrackedApps()
      const usageStat = await getUsageStatForTrackedApps(myTrackedApps)
      const scrollBudget = await getScrollBudget()

      const totalUsage = usageStat.reduce(
        (sum, usage) => sum + usage.totalTimeInForeground,
        0
      )

      const percentageUsed = (totalUsage / scrollBudget) * 100
      const notifiedThresholds = await getNotifiedThresholdsForToday()

      for (const threshold of THRESHOLDS) {
        const alreadyNotified = notifiedThresholds[threshold]
  
        if (percentageUsed >= threshold && !alreadyNotified) {
          const { title, body } = NOTIFICATION_COPY[threshold]
  
          await Notifications.scheduleNotificationAsync({
            content: { title, body },
            trigger: null,
          })
  
          await setNotifiedThresholdsForToday({
            ...notifiedThresholds,
            [threshold]: true,
          })
  
          // Only fire the single highest threshold crossed this run.
          break
        }
      }

      return BackgroundTask.BackgroundTaskResult.Success
    } catch (error) {
      console.error(error);
      return BackgroundTask.BackgroundTaskResult.Failed
    }
    // fetch usage stat, save it to local storage
  })

  if (!await(TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER))) {
    await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
      minimumInterval: MINIMUM_INTERVAL,
    })
  }
}