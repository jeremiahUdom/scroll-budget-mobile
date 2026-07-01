import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/spacing'
import { typography } from '@/constants/typography'
import { fonts } from '@/constants/fonts'
import Ionicons from '@react-native-vector-icons/ionicons'
import AppButton from '@/components/AppButton'
import { updateMyBudget } from '@/app/api/user.api'
import { useRouter } from 'expo-router'
import ErrorModal from '@/components/ErrorModal'
import * as z from "zod"
import { setScrollBudget } from '@/utils/userPreference'
import { minutesToMilliseconds } from '@/utils/formatMinutesToTime'
import GoBackBtn from '@/components/GoBackBtn'

const clamp = (value: number, min: number, max: number) => (
  Math.min(Math.max(value, min), max)
)

const hoursSchema = z.object({
  hours: z.number()
    .min(0, "Hours can only be between 0 and 24")
    .max(24, "Hours can only be between 0 and 24")
})

const minutesSchema = z.object({
  minutes: z.number()
    .min(0, "Minutes can only be between 0 and 60")
    .max(60, "Minutes can only be between 0 and 60")
})

const SetCustomTime = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [updateError, setUpdateError] = useState("")
  const [showUpdateError, setShowUpdateError] = useState(false)
  const [hours, setHours] = useState("0")
  const [minutes, setMinutes] = useState("0")
  const [inputError, setInputError] = useState("")
  const [showInputError, setShowInputError] = useState(false)

  const increaseHourCounter = () => {
    const userInput = parseInt(hours)

    const validation = hoursSchema.safeParse({ hours: userInput })

    if (!validation.success) {
      const error = validation.error.issues[0].message
      setInputError(error)
      setShowInputError(true)
      return
    }

    setHours(clamp(userInput + 1, 0, 24).toString())
    return
  }

  const decreaseHourCounter = () => {
    const userInput = parseInt(hours)
    const validation = hoursSchema.safeParse({ hours: userInput })

    if (!validation.success) {
      const error = validation.error.issues[0].message
      setInputError(error)
      setShowInputError(true)
      return
    }

    setHours(clamp(userInput - 1, 0, 24).toString())
  }

  const increaseMinuteCounter = () => {
    const userInput = parseInt(minutes)
    const validation = minutesSchema.safeParse({ minutes: userInput })

    if (!validation.success) {
      const error = validation.error.issues[0].message
      setInputError(error)
      setShowInputError(true)
      return
    }

    setMinutes(clamp(userInput + 1, 0, 60).toString())
    return
  }

  const decreaseMinuteCounter = () => {
    const userInput = parseInt(minutes)
    const validation = minutesSchema.safeParse({ minutes: userInput })

    if (!validation.success) {
      const error = validation.error.issues[0].message
      setInputError(error)
      setShowInputError(true)
      return
    }

    setMinutes(clamp(userInput - 1, 0, 60).toString())
    return
  }

  const handleHourInputChange = (text: string) => {
    if (text.trim() === "") {
      setHours("")
      return
    }

    const parsed = parseInt(text, 10)
    const validation = hoursSchema.safeParse({ hours: parsed })

    if (!validation.success) {
      const error = validation.error.issues[0].message
      setInputError(error)
      setShowInputError(true)
      return
    }

    setHours(clamp(parsed, 0, 24).toString())
  }

  const handleMinuteInputChange = (text: string) => {
    if (text.trim() === "") {
      setMinutes("")
      return
    }

    const parsed = parseInt(text, 10)

    const validation = minutesSchema.safeParse({ minutes: parsed })

    if (parsed === 60 && parsed <= 60) {
      const userInput = parseInt(hours)
      setHours(clamp(userInput + 1, 0, 24).toString())
      setMinutes("")
      return
    }

    if (!validation.success) {
      const error = validation.error.issues[0].message
      setInputError(error)
      setShowInputError(true)
      return
    }

    setMinutes(clamp(parsed, 0, 60).toString())
  }

  const handleContinue = async () => {
    setLoading(true)
    try {
      // convert budget to minutes and then to milliseconds
      const budgetInMinutes = (parseInt(hours) * 60) + parseInt(minutes)
  
      // sends budget to db for storage
      await updateMyBudget(minutesToMilliseconds(budgetInMinutes))

      // sets budget in local storage for quick access
      await setScrollBudget(minutesToMilliseconds(budgetInMinutes))

      router.replace("/(onboarding)/SelectApps")

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
      <View style={styles.backBtn}>
        <GoBackBtn
          onButtonPressed={() => router.replace("/SetDailyBudget")}
        />
      </View>
      <View style={styles.form}>
        <Text style={styles.heading}>Set your daily limit</Text>
        <Text style={styles.supportingText}>This will be your shared daily budget across all apps.</Text>

        <View style={styles.inputs}>
          <View style={styles.item}>
            <Pressable style={styles.control} onPress={increaseHourCounter}>
              <Ionicons name="chevron-up" size={20} color={colors.darkMuted} />
            </Pressable>

            <TextInput
              style={styles.input}
              value={hours}
              onChangeText={handleHourInputChange}
              keyboardType="number-pad"
            />

            <Pressable style={styles.control} onPress={decreaseHourCounter}>
              <Ionicons name="chevron-down" size={20} color={colors.darkMuted} />
            </Pressable>

            <Text style={styles.label}>Hours</Text>
          </View>

          <View style={styles.colons}>
            <View style={styles.colon} />
            <View style={styles.colon} />
          </View>

          <View style={styles.item}>
            <Pressable style={styles.control} onPress={increaseMinuteCounter}>
              <Ionicons name="chevron-up" size={20} color={colors.darkMuted} />
            </Pressable>

            <TextInput
              style={styles.input}
              value={minutes}
              onChangeText={handleMinuteInputChange}
              keyboardType="number-pad"
            />

            <Pressable style={styles.control} onPress={decreaseMinuteCounter}>
              <Ionicons name="chevron-down" size={20} color={colors.darkMuted} />
            </Pressable>

            <Text style={styles.label}>Minutes</Text>
          </View>
        </View>
      </View>

      <AppButton isLoading={loading} onButtonPressed={handleContinue}>
        Continue
      </AppButton>

      <ErrorModal 
        modalVisible={showUpdateError}
        onCloseModal={() => {
          setShowUpdateError(false)
          setUpdateError("")
        }}
        error={updateError}
      />

      <ErrorModal 
        modalVisible={showInputError}
        onCloseModal={() => setShowInputError(false)}
        error={inputError}
      />
    </SafeAreaView>
  )
}

export default SetCustomTime

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },

  backBtn: {
    marginBottom: spacing.md,
  },

  form: {
    flex: 1,
  },
  
  heading: {
    fontSize: typography.heading,
    fontFamily: fonts.bold,
    color: colors.dark,
    marginBottom: spacing.md
  },

  supportingText: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.darkMuted,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  
  inputs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  
  item: {
    borderRadius: 15,
    alignItems: "center",
    gap: spacing.md,
  },

  control: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: colors.surfaceMuted,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    height: 60,
    width: 80,
    alignItems: "center",
    fontSize: typography.body,
    fontFamily: fonts.semiBold,
    textAlign: "center",
    color: colors.dark,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
  },

  colons: {
    gap: spacing.md,
    alignItems: "center",
  },

  colon: {
    width: 10,
    height: 10,
    backgroundColor: colors.surfaceMuted,
  },

  label: {
    fontFamily: fonts.medium,
    fontSize: typography.label,
    color: colors.dark,
  }
})