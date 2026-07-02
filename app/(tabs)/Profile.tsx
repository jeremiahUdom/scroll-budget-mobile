import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'expo-router'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fonts } from '@/constants/fonts'
import { typography } from '@/constants/typography'
import Ionicons from '@react-native-vector-icons/ionicons'
import AppButton from '@/components/AppButton'
import ErrorModal from '@/components/ErrorModal'
import { setScrollBudget, setTrackedApps } from '@/utils/userPreference'

const Profile = () => {
  const router = useRouter()
  const {userProfile, signout} = useAuth()
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)

  console.log(userProfile)

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.main}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    )
  }

  const handleLogout = async () => {
    try {
      await signout()
      await setTrackedApps([])
      setScrollBudget(0)
      router.replace("/(auth)/Login")
      return
    } catch (error) {
      console.error("error signing out", error)
      if (error instanceof Error) {
        setError(error.message)
        setShowError(true)
        return
      }

      setError("An error occured while creating your account. Please try again")
      setShowError(true)
      return
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View>
          <Image 
            source={{uri: userProfile?.avatarUrl}}
            style={styles.avatar}
            onError={(e) => console.log(e.nativeEvent)}
          />
          <Text style={styles.email}>{userProfile.email}</Text>
        </View>

        <View style={styles.hr} />

        <View style={styles.items}>
          <Pressable onPress={() => router.push("/AccountManagement/ManageScrollBudget")} style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Manage Scroll Budget</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.darkMuted} />
            </View>
          </Pressable>

          <Pressable onPress={() => router.push("/AccountManagement/ManageTrackedApps")} style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Manage Tracked Apps</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.darkMuted} />
            </View>
          </Pressable>

          <Pressable onPress={() => router.push("/AccountManagement/ManageTrackedApps")} style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.darkMuted} />
            </View>
          </Pressable>

          <Pressable onPress={() => router.push("/AccountManagement/ManageTrackedApps")} style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Terms Of Service</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.darkMuted} />
            </View>
          </Pressable>
        </View>

        <AppButton onButtonPressed={handleLogout} customStyle={styles.logout}>
          Logout
        </AppButton>

        <Text style={styles.version}>V 1.0.0</Text>
      </ScrollView>

      <ErrorModal 
        modalVisible={showError}
        onCloseModal={() => setShowError(false)}
        error={error}
      />
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  scroll: {
    gap: spacing.md,
    padding: spacing.lg,
  },

  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceMuted,
  },

  email: {
    fontFamily: fonts.medium,
    fontSize: typography.body,
    color: colors.dark,
    textAlign: "center",
  },

  hr: {
    width: "100%",
    height: 1.5,
    backgroundColor: colors.surfaceMuted,
    marginVertical: spacing.sm,
  },

  totalCard: {
    height: 150,
    borderWidth: 1.5,
    borderColor: colors.surfaceMuted,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    justifyContent: "space-evenly",
  },

  label: {
    color: colors.dark,
    fontFamily: fonts.medium,
    fontSize: typography.body,
  },

  section: {
    padding: spacing.md,
    backgroundColor: colors.light,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
  },

  scrollBudget: {
    padding: spacing.md,
    backgroundColor: colors.light,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    gap: spacing.sm
  },

  scrollBudgetText: {
    fontSize: typography.medium,
    fontFamily: fonts.medium,
    color: colors.dark,
  },

  items: {
    gap: spacing.md,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logout: {
    backgroundColor: colors.danger
  },

  version: {
    fontFamily: fonts.regular,
    fontSize: typography.body,
    color: colors.darkMuted,
    textAlign: "center",
  },
})