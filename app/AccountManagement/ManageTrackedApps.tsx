import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import { typography } from '@/constants/typography'
import { fonts } from '@/constants/fonts'
import AppItem from '@/components/AppItem'
import AppButton from '@/components/AppButton'
import { useFocusEffect, useRouter } from 'expo-router'
import { updateSelectedAppsApi } from '@/api/app.api'
import ErrorModal from '@/components/ErrorModal'
import { getTrackedApps, setTrackedApps } from '@/utils/userPreference'
import GoBackBtn from '@/components/GoBackBtn'
import { getInstalledApps } from '@sahil_sensei/react-native-app-usage'
import { App } from '@/types/App'
import { useUserPreference } from '@/context/UserPreferenceContext'

const SelectApps = () => {
  const router = useRouter()
  const { myTrackedApps, updateTrackedApps } = useUserPreference()
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedApps, setSelectedApps] = useState<App[]>([])
  const [apps, setApps] = useState<App[]>([])
  const [initialising, setInitialising] = useState(true)

  const selectedSet = useMemo(() => new Set(selectedApps.map(app => app.packageName)), [selectedApps])

  const handleSelected = useCallback((packageName: string) => {
    const trackedAppData = apps.find(app => app.packageName === packageName)
    if (!trackedAppData) return;

    setSelectedApps(prev =>
      prev.some(app => app.packageName === packageName)
        ? prev.filter(app => app.packageName !== packageName)
        : [...prev, trackedAppData]
    )
  }, [apps])

  const renderItem = useCallback(({ item }: { item: App }) => (
    <AppItem
      item={item}
      onSelected={handleSelected}
      appSelected={selectedSet.has(item.packageName)}
    />
  ), [handleSelected, selectedSet])

  const keyExtractor = useCallback((item: App) => item.packageName, [])

  const ListHeader = useCallback(() => (
    <Text style={styles.caption}>Scroll down to see all apps</Text>
  ), [])

  useFocusEffect(
    useCallback(() => {
      const fetchSelectedApps = async () => {
        try {
          // get the apps that are already being tracked
          const selectedApps = await getTrackedApps()

          // get all the installed apps on the user's phone
          const installedApps = await getInstalledApps()
          setSelectedApps(myTrackedApps)
          setApps(installedApps)
          return
        } catch (error) {
          console.error("Error loading screen", error)
          if (error instanceof Error) {
            setError(error.message)
            setShowError(true)
            return
          }

          setError("An error occured while loading your dashboard. Please try again")
          setShowError(true)
          return
        } finally {
          setInitialising(false)
        }
      }

      fetchSelectedApps()
    }, [])
  )

  const handleContine = async () => {
    if (selectedApps.length === 0) {
      setError("You have not chosen any app.")
      setShowError(true)
      return
    }

    setLoading(true)
    try {
      await updateTrackedApps(selectedApps)

      // update the selected apps on the server
      await updateSelectedAppsApi(selectedApps.map(app => app.packageName))

      router.replace("/(tabs)/Profile")
      return
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        setShowError(true)
        return
      }

      setError("An error occured while creating your account. Please try again")
      setShowError(true)
      return
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.backBtn}>
        <GoBackBtn 
          onButtonPressed={() => router.replace("/(tabs)/Profile")}
        />
      </View>

      <View style={styles.listView}>
        <Text style={styles.heading}>Choose apps to track</Text>
        <Text style={styles.supportingText}>Pick the apps where you tend to lose time.</Text>

        <View style={styles.listView}>
          <Text style={styles.caption}>{selectedApps.length} apps chosen</Text>
          { 
            initialising ? (
            <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <FlatList 
                data={apps}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListHeaderComponent={ListHeader}
                initialNumToRender={12}
                maxToRenderPerBatch={12}
                windowSize={7}
              />
            )
          }
        </View>
      </View>

      <AppButton isLoading={loading} onButtonPressed={handleContine}>
        Continue
      </AppButton>

      <ErrorModal 
        modalVisible={showError}
        onCloseModal={() => setShowError(false)}
        error={error}
      />
    </SafeAreaView>
  )
}

export default SelectApps

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },

  backBtn: {
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

  caption: {
    fontSize: typography.caption,
    color: colors.darkMuted,
    fontFamily: fonts.regular,
    marginBottom: spacing.md,
  }
})