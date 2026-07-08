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
import ErrorModal from '@/components/ErrorModal'
import { getInstalledApps } from '@sahil_sensei/react-native-app-usage'
import { App } from '@/types/App'
import { useUserPreference } from '@/context/UserPreferenceContext'

const SelectApps = () => {
  const router = useRouter()
  const {updateTrackedApps} = useUserPreference()
  const [initialising, setInitialising] = useState(false)
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedApps, setSelectedApps] = useState<App[]>([])
  const [apps, setApps] = useState<App[]>([])

  const selectedSet = useMemo(() => new Set(selectedApps.map(app => app.packageName)), [selectedApps])

  const handleSelected = useCallback((packageName: string) => {
    const trackedAppData = apps.find(app => app.packageName === packageName)
    if (!trackedAppData) return;

    setSelectedApps(prev =>
      prev.some(app => app.packageName === packageName)
        ? prev.filter(app => app.packageName !== packageName)
        : [...prev, {...trackedAppData}]
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

  const handleContinue = async () => {
    if (selectedApps.length === 0) {
      setError("You have not chosen any app.")
      setShowError(true)
      return
    }

    setLoading(true)
    try {
      // update tracked apps in the context
      await updateTrackedApps(selectedApps)

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
        <Text style={styles.supportingText}>Pick the apps where you tend to lose time, So can help you track your usage. You can change this later.</Text>

        <View style={styles.listView}>
          <Text style={styles.caption}>{selectedApps.length} apps chosen</Text>
          {
            !initialising
            ? <FlatList 
                data={apps}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListHeaderComponent={ListHeader}
                initialNumToRender={12}
                maxToRenderPerBatch={12}
                windowSize={7}
            />
            : <ActivityIndicator size={"large"} color={colors.primary} />
          }
        </View>
      </View>

      <AppButton isLoading={loading} onButtonPressed={handleContinue}>
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
    marginBottom: spacing.md,
  }
})