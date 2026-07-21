import { App } from "@/types/App";
import { getData, saveData } from "../storage";
import { TRACKED_APPS_KEY } from "./localStorage";

export const setTrackedApps = async (apps: App[]) =>
  await saveData(TRACKED_APPS_KEY, apps);

export const getTrackedApps = async (): Promise<App[]> => {
  const apps = await getData<App[]>(TRACKED_APPS_KEY);
  return apps ?? [];
};

export const addTrackedApp = async (app: App) => {
  const currentTrackedApps = await getTrackedApps();
  const newAppIndex = currentTrackedApps.findIndex(
    (item) => item.packageName === app.packageName,
  );

  if (newAppIndex === -1) {
    return;
  }

  return setTrackedApps([...currentTrackedApps, app]);
};

export const removeTrackedApp = async (appPackageName: string) => {
  const current = await getTrackedApps();

  return await setTrackedApps(
    current.filter((app) => app.packageName !== appPackageName),
  );
};
