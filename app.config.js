export default {
  "expo": {
    "name": "Scroll Budget",
    "slug": "scroll-budget",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "scrollbudget",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#1D9E75",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.jeremiahudom.scrollbudget",
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#EAF5F0",
        }
      ],
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/Inter_18pt-Bold.ttf",
            "./assets/fonts/Inter_18pt-SemiBold.ttf",
            "./assets/fonts/Inter_18pt-Medium.ttf",
            "./assets/fonts/Inter_18pt-Regular.ttf"
          ]
        }
      ],
      "expo-background-task",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#FFFFFF",
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "c5fa72af-b779-42dd-aa1b-9e09016cea5b"
      }
    },
    "owner": "jeremiahudom"
  }
}
