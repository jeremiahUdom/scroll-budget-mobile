import AppButton from "@/components/AppButton";
import OnboardingIllustration from "@/components/OnboardingIllustration";
import OnboardingIndicator from "@/components/OnboardingIndicator";
import OnboardingText from "@/components/OnboardingText";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { IoniconsIconName } from "@react-native-vector-icons/ionicons";
import { Link, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export interface OnboardingItem {
  title: string;
  text: string;
  icon: IoniconsIconName;
  color: string;
  iconColor: string;
}

const ONBOARDING_ITEMS: OnboardingItem[] = [
  {
    title: "Choose your apps",
    text: "Select the apps you want to track. They'll all share one daily scroll budget.",
    icon: "apps-outline",
    color: colors.primary,
    iconColor: colors.icon,
  },

  {
    title: "Set a daily budget",
    text: "Choose how much time you want to spend each day across your selected apps.",
    icon: "timer-outline",
    color: colors.icon,
    iconColor: colors.primary,
  },

  {
    title: "Track your progress",
    text: "See where your time goes, get notified as you approach your limit, and build healthier scrolling habits.",
    icon: "pie-chart-outline",
    color: colors.primaryDark,
    iconColor: colors.icon,
  },
];

const Onboarding = () => {
  const router = useRouter();
  const currentItem = useSharedValue(0);

  const handleContinue = () => {
    if (currentItem.value === ONBOARDING_ITEMS.length - 1) {
      currentItem.value = 0;
      router.replace("/Permissions");
      return;
    }
    currentItem.value += 1;
    return;
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.illustrationContainer}>
        {ONBOARDING_ITEMS.map((item, _idx) => (
          <OnboardingIllustration
            key={_idx}
            index={_idx}
            currentItem={currentItem}
            content={item}
          />
        ))}
      </View>

      <View style={styles.onboardingTextContainer}>
        {ONBOARDING_ITEMS.map((item, _idx) => (
          <OnboardingText key={_idx} index={_idx} currentItem={currentItem}>
            {item.text}
          </OnboardingText>
        ))}
      </View>

      <View style={styles.indicators}>
        {ONBOARDING_ITEMS.map((item, _idx) => (
          <OnboardingIndicator
            key={_idx}
            index={_idx}
            currentItem={currentItem}
          />
        ))}
      </View>

      <View style={styles.ctas}>
        <AppButton onButtonPressed={handleContinue}>Continue</AppButton>

        <Link href={"/Permissions"} style={styles.skipText} replace>
          Skip intro
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-around",
    padding: spacing.lg,
  },

  illustrationContainer: {
    height: 400,
    width: "100%",
  },

  onboardingTextContainer: {
    width: "100%",
    height: 100,
    justifyContent: "center",
  },

  indicators: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
  },

  indicatorActive: {
    width: 25,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  ctas: {
    gap: spacing.lg,
  },

  skipBtn: {
    alignItems: "center",
  },

  skipText: {
    color: colors.textSecondary,
    fontSize: typography.medium,
    fontFamily: fonts.semiBold,
    textAlign: "center",
  },
});
