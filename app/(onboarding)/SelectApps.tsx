import AppButton from "@/components/AppButton";
import AppItem from "@/components/AppItem";
import ErrorModal from "@/components/ErrorModal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useUserPreference } from "@/context/UserPreferenceContext";
import { App } from "@/types/App";
import { getInstalledApps } from "@sahil_sensei/react-native-app-usage";
import { Link, useFocusEffect, useRouter } from "expo-router";
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
  const { updateTrackedApps } = useUserPreference();
  const [isFetchingUserInstalledApps, setisFetchingUserInstalledApps] =
    useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedApps, setSelectedApps] = useState<App[]>([]);
  const [apps, setApps] = useState<App[]>([]);

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
    ({ item }: { item: App }) => (
      <AppItem
        item={item}
        onSelected={handleSelected}
        appSelected={selectedSet.has(item.packageName)}
      />
    ),
    [handleSelected, selectedSet],
  );

  const keyExtractor = useCallback((item: App) => item.packageName, []);

  const ListHeader = useCallback(
    () => <Text style={styles.caption}>Scroll down to see all apps</Text>,
    [],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View>
        <Text style={styles.emptyStateTitle}>No Apps Found</Text>
        <Text style={styles.emptyStateText}>
          It looks like you don&apos;t have any apps installed yet
        </Text>
      </View>
    ),
    [],
  );

  // runs immediately the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchSelectedApps = async () => {
        setisFetchingUserInstalledApps(true);
        try {
          // get all the installed apps on the user's phone
          const installedApps = await getInstalledApps();
          const apps: App[] = installedApps.map((app) => ({
            name: app.name,
            packageName: app.packageName,
            icon: app.icon,
          }));
          setApps(apps);
          return;
        } catch (error) {
          console.error("Dashboard load error:", error);
        } finally {
          setisFetchingUserInstalledApps(false);
        }
      };

      fetchSelectedApps();
    }, []),
  );

  const handleContinue = async () => {
    if (selectedApps.length === 0) {
      setError("You have not chosen any app.");
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      // update tracked apps in the context
      await updateTrackedApps(selectedApps);

      router.replace("/SetDailyBudget");

      return;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setShowError(true);
        return;
      }

      setError(
        "An error occured while creating your account. Please try again",
      );
      setShowError(true);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.progress}>
        <View style={styles.steps}>
          <Text style={styles.stepText}>Step 1 of 3</Text>
        </View>

        <Link style={styles.skipText} href={"/(tabs)"} replace>
          Skip
        </Link>
      </View>

      <View style={styles.listView}>
        <Text style={styles.heading}>Choose apps to track</Text>
        <Text style={styles.supportingText}>
          Pick the apps where you tend to lose time, So can help you track your
          usage. You can change this later.
        </Text>

        <View style={styles.listView}>
          {apps.length !== 0 && (
            <Text style={styles.caption}>
              {selectedApps.length} apps chosen
            </Text>
          )}
          {!isFetchingUserInstalledApps ? (
            <FlatList
              data={apps}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListHeaderComponent={apps.length !== 0 ? ListHeader : null}
              initialNumToRender={12}
              maxToRenderPerBatch={12}
              windowSize={7}
              ListEmptyComponent={ListEmptyComponent}
            />
          ) : (
            <ActivityIndicator size={"large"} color={colors.primary} />
          )}
        </View>
      </View>

      <AppButton isLoading={loading} onButtonPressed={handleContinue}>
        Continue
      </AppButton>

      <ErrorModal
        modalVisible={showError}
        onCloseModal={() => setShowError(false)}
        error={error}
      />
    </SafeAreaView>
  );
};

export default SelectApps;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },

  backBtn: {
    marginBottom: spacing.md,
  },

  progress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  steps: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primaryMuted,
    borderRadius: 30,
  },

  stepText: {
    fontSize: typography.caption,
    fontFamily: fonts.medium,
    color: colors.primary,
  },

  skipText: {
    color: colors.darkMuted,
    fontSize: typography.body,
    fontFamily: fonts.medium,
    textAlign: "center",
  },

  heading: {
    fontSize: typography.heading,
    fontFamily: fonts.bold,
    color: colors.dark,
    marginBottom: spacing.sm,
  },

  supportingText: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.darkMuted,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },

  listView: {
    flex: 1,
    paddingVertical: spacing.sm,
  },

  emptyStateTitle: {
    fontFamily: fonts.semiBold,
    fontSize: typography.medium,
    color: colors.darkMuted,
    marginBottom: spacing.sm,
  },

  emptyStateText: {
    fontFamily: fonts.regular,
    fontSize: typography.body,
    color: colors.darkMuted,
  },

  caption: {
    fontSize: typography.caption,
    color: colors.darkMuted,
    fontFamily: fonts.regular,
    marginBottom: spacing.md,
  },
});
