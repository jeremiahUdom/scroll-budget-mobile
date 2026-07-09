import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import { typography } from '@/constants/typography'
import { fonts } from '@/constants/fonts'
import ErrorModal from '@/components/ErrorModal'
import Ionicons from '@react-native-vector-icons/ionicons'
import { Link, useRouter } from 'expo-router'
import AppButton from '@/components/AppButton'
import { minutesToMilliseconds } from '@/utils/formatMinutesToTime'
import { useUserPreference } from '@/context/UserPreferenceContext'

type Item = {
  label: string
  value: number
  type: "hours" | "minutes"
}

const PRESET: Item[] = [
  {
    label: "15 min",
    value: 15,
    type: "minutes"
  }, 

  {
    label: "30 min",
    value: 30,
    type: "minutes"
  }, 

  {
    label: "1 hr",
    value: 60,
    type: "hours"
  }, 

  {
    label: "2 hrs",
    value: 120,
    type: "hours"
  }, 

  {
    label: "Custom",
    value: 0,
    type: "minutes"
  },
]

const SetDailyBudget = () => {
  const router = useRouter()
  const {updateScrollBudget} = useUserPreference()
  const [loading, setLoading] = useState(false)
  const [updateError, setUpdateError] = useState("")
  const [showUpdateError, setShowUpdateError] = useState(false)
  const [selectedItem, setSelectedItem] = useState<number>(0)

  const handleSelected = (item: Item, index: number) => {
    if (index === PRESET.length - 1) {
      router.push("/(onboarding)/SetCustomTime")
      return
    }

    setSelectedItem(item.value)
    return
  }

  const handleContinue = async () => {
    setLoading(true)
    try {
      if (!selectedItem) {
        return
      }

      // updates the scroll budget in the context
      await updateScrollBudget(minutesToMilliseconds(selectedItem))

      router.replace("/(onboarding)/GetNotified")
      return
    } catch (error) {
      if (error instanceof Error) {
        setUpdateError(error.message)
        setShowUpdateError(true)
        return
      }

      setUpdateError("An error occured while creating your account. Please try again")
      setShowUpdateError(true)
      return
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.progress}>
        <View style={styles.steps}>
          <Text style={styles.stepText}>Step 2 of 3</Text>
        </View>

        <Link style={styles.skipText} href={"/SelectApps"} push>
          Skip
        </Link>
      </View>

      <View style={styles.form}>
        <Text style={styles.heading}>How much time do you want to spend on social media daily?</Text>
        <Text style={styles.supportingText}>This will be your shared daily budget across all apps.</Text>

        <View>
          <FlatList 
            data={PRESET}
            keyExtractor={(item, _idx) => _idx.toString()}
            renderItem={({item, index}) => (
              <Pressable 
                onPress={() => handleSelected(item, index)} 
                style={[styles.listItem, selectedItem === item.value ? styles.itemSelected : {}]}
              >
                <Ionicons name={index === PRESET.length - 1 ? "add" : "time-outline" } size={20} color={colors.primary} />
                <Text style={styles.text}>{item.label}</Text>
              </Pressable>
            )}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>

      <AppButton isLoading={loading} onButtonPressed={handleContinue}>
        Continue
      </AppButton>

      <ErrorModal 
        modalVisible={showUpdateError}
        onCloseModal={() => setShowUpdateError(false)}
        error={updateError}
      />
    </SafeAreaView>
  )
}

export default SetDailyBudget

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

  form: {
    flex: 1,
  },

  list: {
    gap: spacing.md,
  },

  listItem: {
    height: 55,
    width: "100%",
    borderWidth: 1.5,
    borderColor: colors.surfaceMuted,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 15,
  },

  text: {
    fontFamily: fonts.medium,
    fontSize: typography.body,
    color: colors.dark,
  },

  itemSelected: {
    backgroundColor: colors.primaryMuted,
  }
})