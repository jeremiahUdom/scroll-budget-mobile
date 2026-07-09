import * as BackgroundTask from "expo-background-task"
import * as TaskManager from "expo-task-manager"
import { getUsageStatForTrackedApps } from "./getUsageStatForTrackedApps"
import { getScrollBudget, getTrackedApps } from "./userPreference"
import { getNotifiedThresholdsForToday, setNotifiedThresholdsForToday } from "./notification"
import { hasUsagePermission } from "@sahil_sensei/react-native-app-usage"
import { notifyBudgetThreshold } from "./notificationService"

const BACKGROUND_TASK_IDENTIFIER = "CHECK_USAGE_STAT"
const MINIMUM_INTERVAL = 15

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

export const checkUsage = async () => {
  // check if user has granted permission to view usageStat
  const permission = await hasUsagePermission()
  
  if (!permission) {
    console.log("Usage permission not granted, skipping this run")
    return BackgroundTask.BackgroundTaskResult.Success
  }
  
  // get users tracked apps from async storage
  const myTrackedApps = await getTrackedApps()

  // getUsageStat for user tracked apps
  const usageStat = await getUsageStatForTrackedApps(myTrackedApps)
  
  // get user scroll budget from async storage
  const scrollBudget = await getScrollBudget()
  
  // check if getScrolBudget returns a value
  if (!scrollBudget || scrollBudget <= 0) {
    return BackgroundTask.BackgroundTaskResult.Success
  }

  // calculates total usage
  const totalUsage = usageStat.reduce(
    (sum, usage) => sum + usage.totalTimeInForeground,
    0
  )

  // computer percentage used
  const percentageUsed = (totalUsage / scrollBudget) * 100
  
  // get notification thresholds
  const notifiedThresholds = await getNotifiedThresholdsForToday()

  for (const threshold of THRESHOLDS) {
    const alreadyNotified = notifiedThresholds[threshold]

    if (percentageUsed >= threshold && !alreadyNotified) {
      const { title, body } = NOTIFICATION_COPY[threshold]

      await notifyBudgetThreshold(title, body)

      await setNotifiedThresholdsForToday({
        ...notifiedThresholds,
        [threshold]: true,
      })

      // Only fire the single highest threshold crossed this run.
      break
    }
  }

  return BackgroundTask.BackgroundTaskResult.Success
}

TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  try {
    return await checkUsage()
  } catch (error) {
    console.error(error)
    return BackgroundTask.BackgroundTaskResult.Failed
  }
})

/**
 * Register the task once.
 */
export const registerBackgroundTask = async (
) => {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER)
  if (isRegistered) {
    return
  }

  await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
    minimumInterval: MINIMUM_INTERVAL,
  })
}