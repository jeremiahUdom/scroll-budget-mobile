import * as Notifications from "expo-notifications"

export const initialiseNotifications = async () => {
  await Notifications.setNotificationChannelAsync("scroll-budget-alerts", {
    name: "Scroll Budget Alerts",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
  })
}

export const requestNotificationsPermission = async () => {
  const settings = await Notifications.getPermissionsAsync()

  if (settings.status === "granted") {
    return true
  }

  const permission = await Notifications.requestPermissionsAsync()

  return permission.status === "granted"
}

export const notifyBudgetThreshold = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default"
    },
    trigger: null,
  })
}