import { Image, Linking, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { spacing } from '@/constants/spacing'
import { colors } from '@/constants/colors'
import { typography } from '@/constants/typography'
import { fonts } from '@/constants/fonts'
import { useRouter } from 'expo-router'
import AppButton from '@/components/AppButton'
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '@/constants/links'
import UsagePreview from '@/components/UsagePreview'
import { useUserPreference } from '@/context/UserPreferenceContext'

const AgreeTermsAndPolicies = () => {
  const router = useRouter()
  const {updateHasOnboarded} = useUserPreference()
  
  const handleContinue = async () => {
    try {
      await updateHasOnboarded(true)
      router.replace("/SelectApps")
      return
    } catch (error) {
      console.error("Failed to update 'hasOnboarded'", error)
    }    
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.view}>
        <View style={styles.view}>
          <View style={styles.appIconWrapper}>
            <Image 
              source={require("@/assets/images/android-icon-foreground.png")}
              style={styles.appIcon}
              resizeMode="contain"
            />
          </View>

          <View style={styles.view}>
            <Text style={styles.title}>Scroll Budget</Text>
            <Text style={styles.body}>Time well spent starts with knowing where it goes.</Text>
          </View>
        </View>
      </View>

      <UsagePreview 
        scrollBudgetInMs={12345678}
        budgetUsedInMs={7200000}
      />

      <View style={styles.view}>
        <View style={styles.view}>
          <AppButton onButtonPressed={handleContinue}>Continue</AppButton>
        </View>

        <Text style={styles.agreement}>
          By continuing, you agree to our <Text onPress={() => Linking.openURL(TERMS_OF_SERVICE_URL)} style={styles.link}>Terms</Text> & <Text onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default AgreeTermsAndPolicies

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    justifyContent: "space-around",
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
  },

  body: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    textAlign: "center",
    color: colors.darkMuted,
    lineHeight: 24,
  },

  view: {
    gap: spacing.sm
  },

  authBtn: {
    width: "100%",
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
  },

  authText: {
    fontSize: typography.body,
    fontFamily: fonts.medium,
    textAlign: "center",
    color: colors.dark,
  },

  link:{
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    color: colors.primary,
  },

  agreement: {
    fontSize: typography.caption,
    fontFamily: fonts.regular,
    textAlign: "center",
    color: colors.darkMuted,
    lineHeight: 24,
  },

  forgotPassword: {
    alignSelf: "flex-end",
  },

  error: {
    fontSize: typography.caption,
    fontFamily: fonts.regular,
    color: colors.danger,
    lineHeight: 24,  
  },
})