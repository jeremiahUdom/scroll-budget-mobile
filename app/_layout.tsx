import {
  UserPreferenceProvider,
  useUserPreference,
} from "@/context/UserPreferenceContext";
import { registerBackgroundTask } from "@/utils/backgroundTask";
import "@/utils/notificationHandler";
import { initialiseNotifications } from "@/utils/notificationService";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const SplashGate = ({ children }: { children: React.ReactNode }) => {
  const { isInitialising } = useUserPreference();

  useEffect(() => {
    const initialiseApp = async () => {
      initialiseNotifications();
      registerBackgroundTask();
    };

    initialiseApp();
  }, []);

  useEffect(() => {
    if (!isInitialising) {
      SplashScreen.hideAsync();
    }
  }, [isInitialising]);

  if (isInitialising) {
    return null;
  }

  return <>{children}</>;
};

const AppLayout = () => {
  return (
    <UserPreferenceProvider>
      <SplashGate>
        <Slot />
      </SplashGate>
    </UserPreferenceProvider>
  );
};

export default AppLayout;
