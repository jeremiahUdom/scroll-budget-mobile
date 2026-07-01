import { StyleSheet, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import AppButton from '@/components/AppButton'
import { spacing } from '@/constants/spacing'
import { typography } from '@/constants/typography'
import { useSharedValue } from "react-native-reanimated";
import OnboardingIndicator from '@/components/OnboardingIndicator'
import OnboardingText from '@/components/OnboardingText'
import { IoniconsIconName } from "@react-native-vector-icons/ionicons";
import OnboardingIllustration from '@/components/OnboardingIllustration'
import { fonts } from '@/constants/fonts'
import { Link, useRouter } from 'expo-router'

export interface OnboardingItem {
  title: string
  text: string
  icon: IoniconsIconName
  color: string
  iconColor: string
}

const ONBOARDING_ITEMS: OnboardingItem[] = [
  {
    title: "Reclaim your scroll time",
    text: "Set a daily scroll budget across all your apps and stick to it without deleting any apps.",
    icon: "time-outline",
    color: colors.primary,
    iconColor: colors.dark,
  },

  {
    title: "See where the time goes",
    text: "Track your screen time across all your selected apps with one shared budget and clear insights.",
    icon: "bar-chart-outline",
    color: colors.dark,
    iconColor: colors.primary,
  },
  
  {
    title:  "Small habits, big change",
    text: "You set the budget. We'll help you stay accountable. One day at a time.",
    icon: "leaf-outline",
    color: colors.primaryDark,
    iconColor: colors.dark,
  },
]

const Onboarding = () => {
  const router = useRouter();
  const currentItem = useSharedValue(0)

  const handleContinue = () => {
    if (currentItem.value === ONBOARDING_ITEMS.length - 1) {
      currentItem.value = 0
      router.replace("/(auth)")
      return
    }
    currentItem.value += 1
    return
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.illustrationContainer}>
        {
          ONBOARDING_ITEMS.map((item, _idx) => (
            <OnboardingIllustration 
              key={_idx}
              index={_idx}
              currentItem={currentItem}
              content={item}
            />
          ))
        }
      </View>

      <View style={styles.onboardingTextContainer}>
        {
          ONBOARDING_ITEMS.map((item, _idx) => (
            <OnboardingText key={_idx} index={_idx} currentItem={currentItem}>
              {item.text}
            </OnboardingText>
          ))
        }
      </View>

      <View style={styles.indicators}>
        {
          ONBOARDING_ITEMS.map((item, _idx) => (
            <OnboardingIndicator key={_idx} index={_idx} currentItem={currentItem} />
          ))
        }
      </View>

      {/* CONTINUE BUTTON */}
      <View style={styles.ctas}>
        <AppButton onButtonPressed={handleContinue}>
          Continue
        </AppButton>

        <Link href={"/(auth)"} style={styles.skipText} replace>Skip intro</Link>
      </View>
    </SafeAreaView>
  )
}

export default Onboarding

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
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
    color: colors.darkMuted,
    fontSize: typography.body,
    fontFamily: fonts.medium,
    textAlign: "center"
  }
});