import AppButton from "@/components/AppButton";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useUserPreference } from "@/context/UserPreferenceContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  hasUsagePermission,
  openUsagePermissionSettings,
} from "@sahil_sensei/react-native-app-usage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  AppState,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Permissions = () => {
  const router = useRouter();
  const wentToSettings = useRef(false);
  const { updateHasOnboarded } = useUserPreference();

  const grantAccess = async () => {
    wentToSettings.current = true;
    await openUsagePermissionSettings();
  };

  const handleSkip = async () => {
    try {
      await updateHasOnboarded(true);
      router.replace("/SelectApps");
      return;
    } catch (error) {
      console.error("Failed to update 'hasOnboarded'", error);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (state) => {
      if (state === "active" && wentToSettings.current) {
        wentToSettings.current = false;
        const granted = await hasUsagePermission();
        if (granted) {
          await updateHasOnboarded(true);
          router.replace("/SelectApps");
        }
      }
    });

    return () => subscription.remove();
  }, [router, updateHasOnboarded]);

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.mainContent}>
        <View style={styles.view}>
          <View style={styles.view}>
            <View style={styles.appIconWrapper}>
              <Image
                source={require("@/assets/images/android-icon-foreground.png")}
                style={styles.appIcon}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>
              Time well spent starts with knowing where it goes.
            </Text>
          </View>
        </View>

        <Text style={styles.body}>
          To track your usage against the budgets you set, scroll budget needs
          usage access. This lets it check how long you&apos;ve spent in the
          apps you choose to track.
        </Text>

        <View style={styles.infoCard}>
          <Ionicons
            name="phone-portrait-outline"
            size={20}
            color={colors.darkMuted}
          />
          <Text style={styles.infoCardSubtitle}>
            Everything stays on your device. No accounts, no internet
            connection, no data ever leaves your phone.
          </Text>
        </View>
      </View>

      <View style={styles.ctas}>
        <AppButton onButtonPressed={grantAccess}>Grant Access</AppButton>

        <Pressable onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>

        <Text style={styles.caption}>
          You&apos;ll be taken to your device settings. Look for scroll budget
          in the list and enable access.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Permissions;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },

  mainContent: {
    flex: 1,
  },

  view: {
    gap: spacing.sm,
  },

  appIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  appIcon: {
    width: 100,
    height: 100,
  },

  title: {
    fontSize: typography.heading,
    fontFamily: fonts.bold,
    textAlign: "center",
    color: colors.dark,
    marginBottom: spacing.md,
  },

  body: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.darkMuted,
    lineHeight: 26,
    marginBottom: spacing.md,
  },

  infoCard: {
    width: "100%",
    padding: spacing.md,
    backgroundColor: colors.primaryMuted,
    borderRadius: 10,
    gap: spacing.xs,
  },

  infoCardSubtitle: {
    fontFamily: fonts.regular,
    color: colors.darkMuted,
    fontSize: typography.label,
    lineHeight: 22,
  },

  caption: {
    fontSize: typography.caption,
    fontFamily: fonts.regular,
    color: colors.darkMuted,
    textAlign: "center",
    lineHeight: 22,
  },

  ctas: {
    gap: spacing.md,
  },

  skipText: {
    color: colors.darkMuted,
    fontSize: typography.body,
    fontFamily: fonts.medium,
    textAlign: "center",
  },
});
