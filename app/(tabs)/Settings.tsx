import SettingsItem from "@/components/SettingsItem";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { PRIVACY_POLICY_URL } from "@/constants/links";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useUserPreference } from "@/context/UserPreferenceContext";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const router = useRouter();
  const { myTrackedApps } = useUserPreference();

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View>
          <View style={styles.items}>
            <SettingsItem
              icon="settings-outline"
              label="Manage Scroll Budget"
              description="Set Your Daily Limit"
              onItemSelected={() =>
                router.push("/AccountManagement/ManageScrollBudget")
              }
            />

            <View style={styles.hr} />

            <SettingsItem
              icon="apps-outline"
              label="Manage Tracked Apps"
              description={`${myTrackedApps.length} apps tracked`}
              onItemSelected={() =>
                router.push("/AccountManagement/ManageTrackedApps")
              }
            />
          </View>
        </View>

        <View>
          <View style={styles.items}>
            <SettingsItem
              icon="shield-outline"
              label="Privacy Policy"
              onItemSelected={() => Linking.openURL(PRIVACY_POLICY_URL)}
            />

            <View style={styles.hr} />

            <SettingsItem
              icon="mail-outline"
              label="Contact Us"
              description="ujsprojects@gmail.com"
              onItemSelected={() =>
                Linking.openURL("mailto:ujsprojects@gmail.com")
              }
            />
          </View>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  title: {
    fontSize: typography.heading,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xxl,
  },

  scroll: {
    gap: spacing.md,
  },

  items: {
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
  },

  hr: {
    width: "100%",
    height: 1.5,
    backgroundColor: colors.surfaceMuted,
  },

  version: {
    fontFamily: fonts.regular,
    fontSize: typography.small,
    color: colors.textMuted,
    textAlign: "center",
  },
});
