import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fonts } from '@/constants/fonts'
import { typography } from '@/constants/typography'
import Ionicons from '@react-native-vector-icons/ionicons'
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '@/constants/links'
import { useUserPreference } from '@/context/UserPreferenceContext'

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
            <Pressable onPress={() => router.push("/AccountManagement/ManageScrollBudget")} style={styles.item}>
              <View style={styles.row}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="settings-outline" size={15} color={colors.primary}  />
                </View>
                <View>
                  <Text style={styles.label}>Manage Scroll Budget</Text>
                  <Text style={styles.description}>Set your daily limit</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.darkMuted} />
            </Pressable>

            <View style={styles.hr} />

            <Pressable onPress={() => router.push("/AccountManagement/ManageTrackedApps")} style={styles.item}>
              <View style={styles.row}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="apps" size={15} color={colors.primary}  />
                </View>
                <View>
                  <Text style={styles.label}>Manage Tracked Apps</Text>
                  <Text style={styles.description}>{myTrackedApps.length} apps tracked</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.darkMuted} />
            </Pressable>
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Legal</Text>

          <View style={styles.items}>
            <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} style={styles.item}>
              <View style={styles.row}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="shield-outline" size={15} color={colors.primary}  />
                </View>
                <View>
                  <Text style={styles.label}>Privacy Policy</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.darkMuted} />
            </Pressable>

            <View style={styles.hr} />

            <Pressable onPress={() => Linking.openURL(TERMS_OF_SERVICE_URL)} style={styles.item}>
              <View style={styles.row}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="document-text-outline" size={15} color={colors.primary}  />
                </View>
                <View>
                  <Text style={styles.label}>Terms of Service</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.darkMuted} />
            </Pressable>
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

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },

  row: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },

  iconWrapper: {
    width: 35,
    height: 35,
    backgroundColor: colors.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  label: {
    color: colors.dark,
    fontFamily: fonts.medium,
    fontSize: typography.body,
  },

  description: {
    color: colors.darkMuted,
    fontFamily: fonts.regular,
    fontSize: typography.small,
  },

  version: {
    fontFamily: fonts.regular,
    fontSize: typography.small,
    color: colors.darkMuted,
    textAlign: "center",
  },
})