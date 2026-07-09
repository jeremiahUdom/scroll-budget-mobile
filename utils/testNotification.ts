import * as Notifications from 'expo-notifications'

export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Scroll Budget',
      body: 'Notifications are working 🎉',
    },
    trigger: null,
  })
}