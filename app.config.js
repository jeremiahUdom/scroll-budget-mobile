export default {
  "expo": {
    "name": "scroll-budget",
    "slug": "scroll-budget",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "scrollbudget",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.jeremiahudom.scrollbudget",
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON,
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
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
      "@react-native-firebase/app",
      "@react-native-firebase/auth"
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
