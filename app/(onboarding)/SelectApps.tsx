import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import { typography } from '@/constants/typography'
import { fonts } from '@/constants/fonts'
import AppItem from '@/components/AppItem'
import AppButton from '@/components/AppButton'
import { Link, useFocusEffect, useRouter } from 'expo-router'
import { storeSelectedAppsApi } from '@/app/api/app.api'
import ErrorModal from '@/components/ErrorModal'
import { setTrackedApps } from '@/utils/userPreference'
import { getInstalledApps } from '@sahil_sensei/react-native-app-usage'
import { App } from '@/types/App'

const SelectApps = () => {
  const router = useRouter()
  const [initialising, setInitialising] = useState(false)
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [apps, setApps] = useState<App[]>([])

  const selectedSet = useMemo(() => new Set(selectedApps), [selectedApps])

  const handleSelected = useCallback((packageName: string) => {
    setSelectedApps(prev =>
      prev.includes(packageName)
        ? prev.filter(p => p !== packageName)
        : [...prev, packageName]
    )
  }, [])

  const renderItem = useCallback(({ item }: { item: App }) => (
    <AppItem 
      item={item}
      onSelected={handleSelected}
      appSelected={selectedSet.has(item.packageName)}
    />
  ), [handleSelected, selectedSet])

  const keyExtractor = useCallback((item: App) => item.packageName, [])

  const ListFooter = useCallback(() => (
    <Text style={styles.caption}>{selectedApps.length} apps chosen</Text>
  ), [selectedApps.length])
  
  // runs immediately the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchSelectedApps = async () => {
        setInitialising(true)
        try {
          // get all the installed apps on the user's phone
          const installedApps = await getInstalledApps()
          setApps(installedApps)
          return
        } catch (error) {
          console.error('Dashboard load error:', error)
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
      // send selected apps to the database for storage
      await storeSelectedAppsApi(selectedApps)

      // store the users selected apps on the local storage for fast lookup.
      setTrackedApps(selectedApps)

      router.replace("/(tabs)")
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
      <View style={styles.progress}>
        <View style={styles.steps}>
          <Text style={styles.stepText}>Step 2 of 2</Text>
        </View>

        <Link style={styles.skipText} href={"/(tabs)"} replace>
          Skip
        </Link>
      </View>

      <View style={styles.listView}>
        <Text style={styles.heading}>Choose apps to track</Text>
        <Text style={styles.supportingText}>Pick the apps where you tend to lose time. You can change this later.</Text>

        <View style={styles.listView}>
          {
            !initialising
            ? <FlatList 
                data={apps}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListFooterComponent={ListFooter}
            />
            : <ActivityIndicator size={"large"} color={colors.primary} />
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

  caption: {
    fontSize: typography.caption,
    color: colors.darkMuted,
    fontFamily: fonts.regular,
  }
})