import AppButton from "@/components/AppButton";
import AppItem from "@/components/AppItem";
import ErrorModal from "@/components/ErrorModal";
import GoBackBtn from "@/components/GoBackBtn";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useUserPreference } from "@/context/UserPreferenceContext";
import { App } from "@/types/App";
import { AppError } from "@/types/AppError";
import { getInstalledApps } from "@sahil_sensei/react-native-app-usage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SelectApps = () => {
  const router = useRouter();
  const { myTrackedApps, updateTrackedApps } = useUserPreference();
  const [loading, setLoading] = useState(false);
  const [selectedApps, setSelectedApps] = useState<App[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [initialising, setInitialising] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const selectedSet = useMemo(
    () => new Set(selectedApps.map((app) => app.packageName)),
    [selectedApps],
  );

  const handleSelected = useCallback((app: App) => {
    setSelectedApps((prev) =>
      prev.some((item) => item.packageName === app.packageName)
        ? prev.filter((item) => item.packageName !== app.packageName)
        : [...prev, { ...app }],
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: App }) => {
      const isSelected = selectedSet.has(item.packageName);
      return (
        <AppItem
          item={item}
          onSelected={handleSelected}
          appSelected={isSelected}
        />
      );
    },
    [handleSelected, selectedSet],
  );

  const keyExtractor = useCallback((item: App) => item.packageName, []);

  useFocusEffect(
    useCallback(() => {
      const fetchSelectedApps = async () => {
        try {
          // get all the installed apps on the user's phone
          const installedApps = await getInstalledApps();
          const apps: App[] = installedApps.map((app) => ({
            name: app.name,
            packageName: app.packageName,
            icon: app.icon,
          }));
          setApps(apps);
          setSelectedApps(myTrackedApps);
          setInitialising(false);
          return;
        } catch (error) {
          console.error("Error loading screen", error);
          setError({
            visible: true,
            title: "Couldn't load your apps",
            message:
              "We couldn't load the apps installed on your device. Please try again.",
          });
          setInitialising(false);
          return;
        }
      };

      fetchSelectedApps();
    }, [myTrackedApps]),
  );

  const handleContine = async () => {
    if (selectedApps.length === 0) {
      setError({
        visible: true,
        title: "No apps selected",
        message: "Choose at least one app to continue.",
      });
      return;
    }

    setLoading(true);
    try {
      // update tracked apps in the preference context
      await updateTrackedApps(selectedApps);

      router.replace("/(tabs)/Settings");

      setLoading(false);

      return;
    } catch (error) {
      console.error(
        "An error occured while trying to save your selected apps.",
        error,
      );
      setError({
        visible: true,
        title: "Couldn't save your selection",
        message:
          "An error occurred while saving your selected apps. Please try again.",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.backBtn}>
        <GoBackBtn onButtonPressed={() => router.replace("/(tabs)/Settings")} />
      </View>

      <View style={styles.listView}>
        <Text style={styles.heading}>Choose apps to track</Text>
        <Text style={styles.supportingText}>
          Pick the apps where you tend to lose time. So can help you track your
          usage. You can change this later
        </Text>

        <View style={styles.listView}>
          {apps.length !== 0 && (
            <Text style={styles.caption}>
              {selectedApps.length} apps chosen
            </Text>
          )}
          {initialising ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <FlatList
              data={apps}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              initialNumToRender={12}
              maxToRenderPerBatch={12}
              windowSize={7}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>No Apps Found</Text>
                  <Text style={styles.emptyStateText}>
                    It looks like you don&apos;t have any apps installed yet
                  </Text>
                </View>
              }
              style={styles.list}
            />
          )}
        </View>
      </View>

      <AppButton isLoading={loading} onButtonPressed={handleContine}>
        Continue
      </AppButton>

      <ErrorModal
        visible={error?.visible ?? false}
        title={error?.title ?? ""}
        message={error?.message ?? ""}
        onClose={() => setError(null)}
      />
    </SafeAreaView>
  );
};

export default SelectApps;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  backBtn: {
    marginBottom: spacing.md,
  },

  heading: {
    fontSize: typography.heading,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  supportingText: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },

  listView: {
    flex: 1,
    paddingVertical: spacing.sm,
  },

  list: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    paddingHorizontal: spacing.sm,
  },

  emptyState: {
    paddingTop: spacing.md,
  },

  emptyStateTitle: {
    fontFamily: fonts.semiBold,
    fontSize: typography.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  emptyStateText: {
    fontFamily: fonts.regular,
    fontSize: typography.body,
    color: colors.textMuted,
  },

  caption: {
    fontSize: typography.caption,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginBottom: spacing.md,
  },
});
