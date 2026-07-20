import { getData, saveData } from "../storage";
import { HAS_PERMISSION_TO_VIEW_USAGE_STATS_KEY } from "./localStorage";

export const setUsageStatsPermission = async (value: boolean) =>
  await saveData(HAS_PERMISSION_TO_VIEW_USAGE_STATS_KEY, value);

export const getUsageStatsPermission = async (): Promise<boolean> => {
  const hasPermissionToViewUsageStat = await getData<boolean>(
    HAS_PERMISSION_TO_VIEW_USAGE_STATS_KEY,
  );
  return hasPermissionToViewUsageStat ?? false;
};
