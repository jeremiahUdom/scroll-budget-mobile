# Scroll Budget

React Native / Expo Android app for Scroll Budget — track time spent on the apps you choose, set daily limits, and view usage insights.

---

## Tech Stack

- **Framework:** React Native + Expo (Expo Router)
- **Language:** TypeScript
- **Charts:** react-native-gifted-charts
- **Animation:** react-native-svg + react-native-reanimated
- **Usage tracking:** `@sahil_sensei/react-native-app-usage`

---

## Prerequisites

- Node.js (LTS recommended)
- Expo CLI (`npm install -g expo-cli` or use `npx expo`)
- Android device or emulator (Usage Access features require a physical Android device or an emulator with usage-stats support — some emulators don't reliably report usage stats)
- EAS CLI for builds (`npm install -g eas-cli`)
- google-services.json

## Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/jeremiahUdom/scroll-budget-mobile.git
   cd scroll-budget-mobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the app**

   ```bash
   npx expo start
   ```

   Scan the QR code with Expo Go, or press `a` to launch on a connected Android device/emulator.

   > **Note:** Usage Access tracking relies on a native module (`@sahil_sensei/react-native-app-usage`), which is **not available in Expo Go**. To test tracking end-to-end, build a dev client (see below) rather than relying on Expo Go alone.

---

## Building for Android

This project uses **EAS Build** for producing installable APKs.

```bash
eas build --platform android --profile development
```

- `development` profile → generates a debug build with expo-dev-client bundled in, for use with `npx expo start --dev-client` during active development
- `preview` profile → generates an installable APK for internal testing/dev builds
- `production` profile → generates an AAB for Play Store submission

Make sure your EAS secrets (env vars, `google-services.json`) are configured via `eas secret:create` or the EAS dashboard before building.

---

## Project Structure

```
android/            # Native Android project files
app/                # Expo Router screens (file-based routing)
assets/             # Images, fonts, and other static assets
components/         # Reusable UI components
constants/          # Colors, spacing, typography, fonts
context/            # Auth & user preference providers
hooks/              # Shared custom hooks
scripts/            # One-off / dev scripts
types/              # Shared TypeScript types
utils/              # Local storage helpers (tracked apps, preferences)
```

---

## Known Gotchas

- **Usage Access permission** can't be requested via a normal runtime dialog — it must be granted manually via Android Settings. Use the library's `hasUsagePermission()` / `openUsagePermissionSettings()` helpers to guide users there.

---

## License

All Rights Reserved.
