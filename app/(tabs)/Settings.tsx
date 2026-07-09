import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fonts } from '@/constants/fonts'
import { typography } from '@/constants/typography'
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '@/constants/links'
import { useUserPreference } from '@/context/UserPreferenceContext'
import SettingsItem from '@/components/SettingsItem'

const Profile = () => {
  const router = useRouter()
  const { myTrackedApps } = useUserPreference()

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View>
          <Text style={styles.sectionLabel}>App</Text>

          <View style={styles.items}>
            <SettingsItem
              icon="settings-outline"
              label='Manage Scroll Budget'
              description='Set Your Daily Limit' 
              onItemSelected={() => router.push("/AccountManagement/ManageScrollBudget")}
            />

            <View style={styles.hr} />

            <SettingsItem
              icon="apps-outline"
              label='Manage Tracked Apps'
              description={`${myTrackedApps.length} apps tracked`}
              onItemSelected={() => router.push("/AccountManagement/ManageTrackedApps")}
            />
          </View>
          
        </View>

        <View>
          <Text style={styles.sectionLabel}>Legal</Text>

          <View style={styles.items}>
            <SettingsItem
              icon="shield-outline"
              label='Privacy Policy'
              onItemSelected={() => Linking.openURL(PRIVACY_POLICY_URL)}
            />

            <View style={styles.hr} />

            <SettingsItem
              icon="document-text-outline"
              label='Terms of Service'
              onItemSelected={() => Linking.openURL(TERMS_OF_SERVICE_URL)}
            />
          </View>
        </View>

        <Text style={styles.version}>Version V 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },

  title: {
    fontSize: typography.heading,
    fontFamily: fonts.semiBold,
    color: colors.dark,
    marginBottom: spacing.xxl,
  },

  scroll: {
    gap: spacing.md,
  },

  items: {
    paddingHorizontal: spacing.md,
    backgroundColor: colors.light,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
  },

  sectionLabel: {
    textTransform: "uppercase",
    color: colors.darkMuted,
    fontFamily: fonts.medium,
    fontSize: typography.small,
    marginBottom: spacing.md,
  },

  hr: {
    width: "100%",
    height: 1.5,
    backgroundColor: colors.surfaceMuted,
  },

  version: {
    fontFamily: fonts.regular,
    fontSize: typography.small,
    color: colors.darkMuted,
    textAlign: "center",
  },
})