import AppUsageCard from "@/components/AppUsageCard";
import ErrorModal from "@/components/ErrorModal";
import PermissionModal from "@/components/PermissionModal";
import UsagePreview from "@/components/UsagePreview";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useUserPreference } from "@/context/UserPreferenceContext";
import { TrackedAppUsageStat } from "@/types/App";
import { formatDurationFromMilliseconds } from "@/utils/formatMinutesToTime";
import { setUsageStatsPermission } from "@/utils/localDataManager/usageStatStorage";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  getHourlyUsage,
  hasUsagePermission,
  openUsagePermissionSettings,
} from "@sahil_sensei/react-native-app-usage";
import { Link } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Dashboard = () => {
  const today = new Date();
  const { scrollBudgetInMs, myTrackedApps, hasPermissionToViewUsageStats } =
    useUserPreference();
  const [usageStats, setUsageStats] = useState<TrackedAppUsageStat[]>([]);
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const wentToSettings = useRef(false);

  const isInitialLoad = usageStats.length === 0;

  const checkPermission = useCallback(async () => {
    const permission = await hasUsagePermission();
    setUsageStatsPermission(permission);
  }, []);

  const loadDashboard = useCallback(async () => {
    if (myTrackedApps.length === 0) {
      setUsageStats([]);
      return;
    }

    setLoadingUsage(true);

    try {
      // make only one API Call to fetch everything. i will fix this by writing the native code to fetch usage stats by myself using expo native modules
      const usageStats = (
        await Promise.all(
          myTrackedApps.map(async (app) => {
            const totalTimeInForeground = (
              await getHourlyUsage(app.packageName)
            ).reduce((sum, hour) => sum + hour.durationMs, 0);

            return {
              ...app,
              totalTimeInForeground,
            };
          }),
        )
      ).sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground);

      setUsageStats(usageStats);
      setLoadingUsage(false);
    } catch (error) {
      console.error("Dashboard load error:", error);
      setError(
        "An error occured while loading your dashboard. Please try again",
      );
      setShowError(true);
      setLoadingUsage(false);
    }
  }, [myTrackedApps, setUsageStats, setLoadingUsage, setError, setShowError]);

  // check app state
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (state) => {
      if (state === "active" && wentToSettings.current) {
        wentToSettings.current = false;
        await checkPermission();
      }
    });

    return () => subscription.remove();
  }, [checkPermission]);

  useEffect(() => {
    if (hasPermissionToViewUsageStats) {
      void loadDashboard();
      setShowPermissionModal(false);
      return;
    }
  }, [hasPermissionToViewUsageStats, loadDashboard]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // Calculate total usage in milliseconds for all tracked apps
  const totalUsageInMs = useMemo(
    () => usageStats.reduce((sum, app) => sum + app.totalTimeInForeground, 0),
    [usageStats],
  );

  const handlePermissionModalDismiss = () => {
    setShowPermissionModal(false);
  };

  const handleOpenSettings = () => {
    wentToSettings.current = true;
    setShowPermissionModal(false);
  };

  const handleEnablePress = () => {
    wentToSettings.current = true;
    openUsagePermissionSettings();
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyTextContainer}>
        <Text style={styles.emptyTitle}>No app data available</Text>
        <Text style={styles.emptySubtitle}>
          You haven&apost selected any apps yet. To see your usage stats, please
          add apps to your tracked list.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.main}>
      {/* Warning banner */}
      {!hasPermissionToViewUsageStats && (
        <View style={styles.warningBanner}>
          <Ionicons name="alert-circle" size={20} color={colors.warning} />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Enable Usage Access</Text>
            <Text style={styles.bannerSubtitle}>
              Grant permission to see your stats
            </Text>
          </View>
          <Pressable style={styles.enableButton} onPress={handleEnablePress}>
            <Text style={styles.enableButtonText}>Enable</Text>
          </Pressable>
        </View>
      )}

      {loadingUsage && (
        <ActivityIndicator size="small" color={colors.primary} />
      )}

      <View>
        <Text style={styles.title}>Scroll Budget</Text>
        <Text style={styles.weekday}>
          {today.toLocaleDateString("en-US", { weekday: "long" })}
        </Text>
        <View style={styles.dateRow}>
          <Text style={styles.dateRowText}>
            {today.toLocaleDateString("en-us", { dateStyle: "long" })}
          </Text>
          {scrollBudgetInMs > 0 && (
            <>
              <View style={styles.dotSeparator} />
              <Text style={styles.dateRowText}>
                {formatDurationFromMilliseconds(scrollBudgetInMs)} daily budget
              </Text>
            </>
          )}
        </View>
        {scrollBudgetInMs === 0 && (
          <Link
            href="/AccountManagement/ManageScrollBudget"
            style={styles.setBudgetText}
          >
            Set your daily budget
          </Link>
        )}
      </View>

      <View>
        <UsagePreview
          scrollBudgetInMs={scrollBudgetInMs}
          budgetUsedInMs={totalUsageInMs}
          isDashboardLoading={isInitialLoad}
        />
      </View>

      <View style={styles.listView}>
        <FlatList
          data={usageStats}
          keyExtractor={(item) => item.packageName}
          renderItem={({ item }) => (
            <AppUsageCard scrollBudgetInMs={scrollBudgetInMs} app={item} />
          )}
          ItemSeparatorComponent={() => (
            <View style={styles.listItemSeparator} />
          )}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>

      <PermissionModal
        visible={showPermissionModal}
        onOpenSettings={handleOpenSettings}
        onDismiss={handlePermissionModalDismiss}
      />
      <ErrorModal
        modalVisible={showError}
        onCloseModal={() => setShowError(false)}
        error={error}
      />
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },

  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.warningLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: colors.warningMuted,
  },

  bannerText: {
    flex: 1,
  },

  bannerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: typography.small,
    color: colors.dark,
    marginTop: 2,
    textTransform: "uppercase",
  },

  bannerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: typography.xs,
    color: colors.darkMuted,
  },

  enableButton: {
    backgroundColor: colors.warning,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },

  enableButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: typography.xs,
    color: colors.surface,
  },

  title: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.darkMuted,
    textTransform: "uppercase",
  },

  weekday: {
    fontSize: typography.heading,
    fontFamily: fonts.semiBold,
    color: colors.dark,
  },

  dateRow: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
  },

  dateRowText: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.darkMuted,
  },

  dotSeparator: {
    width: 5,
    height: 5,
    backgroundColor: colors.darkMuted,
    borderRadius: 2.5,
  },

  setBudgetText: {
    color: colors.primary,
    fontFamily: fonts.semiBold,
    fontSize: typography.body,
    marginTop: spacing.sm,
  },

  listView: {
    flex: 1,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTextContainer: {
    alignItems: "center",
    maxWidth: 300,
  },

  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: typography.body,
    color: colors.dark,
    textAlign: "center",
  },

  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: typography.caption,
    color: colors.darkMuted,
    textAlign: "center",
  },

  listItemSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.surfaceMuted,
  },
});
